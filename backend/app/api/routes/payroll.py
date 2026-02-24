from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal
import calendar

from app.core.database import get_db
from app.models.payroll import SalaryStructure, AutoPayOSRecord, AutoPay-OSStatus
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.payroll import (
    SalaryStructure as SalaryStructureSchema,
    SalaryStructureCreate,
    SalaryStructureUpdate,
    AutoPayOSRecord as AutoPayOSRecordSchema,
    AutoPayOSProcessRequest,
    AutoPayOSSummary
)
from app.api import dependencies
from app.models.user import UserRole
from app.services.anomaly_detection import AnomalyDetectionService

router = APIRouter()

@router.get("/salary-structures/{employee_id}", response_model=SalaryStructureSchema)
def get_salary_structure(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.get_current_user)
):
    db_structure = db.query(SalaryStructure).filter(SalaryStructure.employee_id == employee_id).first()
    if not db_structure:
        raise HTTPException(status_code=404, detail="Salary structure not found")
    return db_structure

@router.post("/salary-structures", response_model=SalaryStructureSchema)
def create_salary_structure(
    structure: SalaryStructureCreate,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    db_structure = db.query(SalaryStructure).filter(SalaryStructure.employee_id == structure.employee_id).first()
    if db_structure:
        raise HTTPException(status_code=400, detail="Salary structure already exists for this employee")
    
    db_structure = SalaryStructure(**structure.model_dump())
    db.add(db_structure)
    db.commit()
    db.refresh(db_structure)
    return db_structure

@router.put("/salary-structures/{employee_id}", response_model=SalaryStructureSchema)
def update_salary_structure(
    employee_id: int,
    structure: SalaryStructureUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    db_structure = db.query(SalaryStructure).filter(SalaryStructure.employee_id == employee_id).first()
    if not db_structure:
        raise HTTPException(status_code=404, detail="Salary structure not found")
    
    update_data = structure.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_structure, key, value)
    
    db.commit()
    db.refresh(db_structure)
    return db_structure

@router.post("/process", response_model=List[AutoPayOSRecordSchema])
def process_payroll(
    request: AutoPayOSProcessRequest,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    results = []
    
    # Days in month
    _, num_days = calendar.monthrange(request.year, request.month)
    
    for emp_id in request.employee_ids:
        # 1. Get employee and salary structure
        employee = db.query(Employee).filter(Employee.id == emp_id).first()
        if not employee or not employee.salary_structure:
            continue
            
        structure = employee.salary_structure
        
        # 2. Get attendance for the month
        start_date = date(request.year, request.month, 1)
        end_date = date(request.year, request.month, num_days)
        
        attendance = db.query(Attendance).filter(
            Attendance.employee_id == emp_id,
            Attendance.date >= start_date,
            Attendance.date <= end_date
        ).all()
        
        # Calculate paid days
        present_days = sum(1 for a in attendance if a.status == 'present')
        half_days = sum(Decimal("0.5") for a in attendance if a.status == 'half-day')
        leave_days = sum(1 for a in attendance if a.status == 'leave')
        
        paid_days = Decimal(present_days) + half_days + Decimal(leave_days)
        absent_days = Decimal(num_days) - paid_days
        
        # 3. Calculate Earnings (Pro-rated)
        pro_rate_factor = Decimal(paid_days) / Decimal(num_days)
        basic_earned = structure.basic * pro_rate_factor
        hra_earned = structure.hra * pro_rate_factor
        conv_earned = structure.conveyance * pro_rate_factor
        med_earned = structure.medical_allowance * pro_rate_factor
        special_earned = structure.special_allowance * pro_rate_factor
        
        gross_earnings = basic_earned + hra_earned + conv_earned + med_earned + special_earned
        
        # 4. Calculate Deductions (Simplified Indian Rules)
        pf_deduction = Decimal("0.0")
        if structure.pf_enabled:
            # Standard 12% of Basic
            pf_deduction = basic_earned * Decimal("0.12")
            
        esi_deduction = Decimal("0.0")
        if structure.esi_enabled and gross_earnings <= Decimal("21000"):
            # Employee contribution 0.75%
            esi_deduction = gross_earnings * Decimal("0.0075")
            
        pt_deduction = Decimal("0.0")
        if structure.pt_enabled:
            # TN Professional Tax (Simplified Slab)
            if gross_earnings > Decimal("12500"): pt_deduction = Decimal("250.0")
            elif gross_earnings > Decimal("10000"): pt_deduction = Decimal("150.0")
            elif gross_earnings > Decimal("7500"): pt_deduction = Decimal("100.0")
        
        total_deductions = pf_deduction + esi_deduction + pt_deduction
        net_pay = gross_earnings - total_deductions
        
        # 4.5. Employer Contributions (Advanced Compliance)
        employer_pf = Decimal("0.0")
        if structure.employer_pf_enabled:
            # Employer contribution is also 12% of Basic
            employer_pf = basic_earned * Decimal("0.12")
            
        employer_esi = Decimal("0.0")
        if structure.employer_esi_enabled and gross_earnings <= Decimal("21000"):
            # Employer contribution is 3.25%
            employer_esi = gross_earnings * Decimal("0.0325")

        # 5. Create or Update AutoPay-OS Record
        db_record = db.query(AutoPayOSRecord).filter(
            AutoPayOSRecord.employee_id == emp_id,
            AutoPayOSRecord.month == request.month,
            AutoPayOSRecord.year == request.year
        ).first()
        
        if db_record:
            db_record.paid_days = paid_days
            db_record.absent_days = absent_days
            db_record.gross_earnings = gross_earnings
            db_record.total_deductions = total_deductions
            db_record.net_pay = net_pay
            db_record.basic_earned = basic_earned
            db_record.hra_earned = hra_earned
            db_record.conveyance_earned = conv_earned
            db_record.medical_earned = med_earned
            db_record.special_earned = special_earned
            db_record.pf_deduction = pf_deduction
            db_record.esi_deduction = esi_deduction
            db_record.pt_deduction = pt_deduction
            db_record.employer_pf_contribution = employer_pf
            db_record.employer_esi_contribution = employer_esi
            db_record.status = AutoPay-OSStatus.PROCESSED
            db_record.processed_at = datetime.now()
        else:
            db_record = AutoPayOSRecord(
                employee_id=emp_id,
                company_id=employee.company_id,
                month=request.month,
                year=request.year,
                paid_days=paid_days,
                absent_days=absent_days,
                gross_earnings=gross_earnings,
                total_deductions=total_deductions,
                net_pay=net_pay,
                basic_earned=basic_earned,
                hra_earned=hra_earned,
                conveyance_earned=conv_earned,
                medical_earned=med_earned,
                special_earned=special_earned,
                pf_deduction=pf_deduction,
                esi_deduction=esi_deduction,
                pt_deduction=pt_deduction,
                employer_pf_contribution=employer_pf,
                employer_esi_contribution=employer_esi,
                status=AutoPay-OSStatus.PROCESSED,
                processed_at=datetime.now()
            )
            db.add(db_record)
            
        results.append(db_record)
        
    db.commit()
    for r in results:
        db.refresh(r)
        # 6. Run AI Anomaly Detection
        try:
            AnomalyDetectionService.analyze_payroll_record(db, r)
        except Exception as e:
            print(f"Warning: Anomaly detection failed for record {r.id}: {e}")
            
    return results

@router.get("/history/{employee_id}", response_model=List[AutoPayOSRecordSchema])
def get_payroll_history(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.get_current_user)
):
    return db.query(AutoPayOSRecord).filter(AutoPayOSRecord.employee_id == employee_id).order_by(AutoPayOSRecord.year.desc(), AutoPayOSRecord.month.desc()).all()
