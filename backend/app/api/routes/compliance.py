from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from decimal import Decimal

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.employee import Employee
from app.models.autopay_os import AutoPayOSRecord
from app.models.company import Company
from app.services.pdf_service import PDFService
from app.services.compliance_service import ComplianceService

router = APIRouter()

@router.get("/form16/{employee_id}")
async def download_form_16(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Generates and returns Form 16 PDF for an employee."""
    employee = db.query(Employee).filter(Employee.id == employee_id, Employee.company_id == current_user.company_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    
    # Calculate mock data from autopay_os records
    records = db.query(AutoPayOSRecord).filter(AutoPayOSRecord.employee_id == employee_id).all()
    gross = sum(Decimal(r.gross_earnings) for r in records)
    tax = sum(Decimal(r.income_tax_deduction or 0) for r in records)
    
    data = {
        "gross": f"{float(gross):,.2f}",
        "taxable": f"{float(gross - 75000):,.2f}",
        "tax": f"{float(tax):,.2f}"
    }
    
    pdf_buffer = PDFService.generate_form_16(
        employee_name=employee.full_name,
        pan=employee.pan_number or "NOT PROVIDED",
        company_name=company.name,
        tan=company.tan or "NOT PROVIDED",
        year="2025-26",
        data=data
    )
    
    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Form16_{employee.employee_code}.pdf"}
    )

@router.get("/form24q")
async def download_form_24q(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Generates and returns Quarterly Form 24Q PDF for the company."""
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    
    # Fetch all employees with TDS deduction
    records = db.query(
        Employee.full_name,
        Employee.pan_number,
        AutoPayOSRecord.income_tax_deduction
    ).join(AutoPayOSRecord, AutoPayOSRecord.employee_id == Employee.id)\
     .filter(Employee.company_id == current_user.company_id)\
     .all()
     
    formatted_records = [
        {"name": r[0], "pan": r[1] or "NA", "tds": f"{float(r[2] or 0):,.2f}"}
        for r in records
    ]
    
    pdf_buffer = PDFService.generate_form_24q(company.name, formatted_records)
    
    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Form24Q_{company.name}.pdf"}
    )

@router.get("/pf-ecr")
async def download_pf_ecr(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Generates and returns PF ECR text file for the company."""
    ecr_text = ComplianceService.generate_pf_ecr(db, current_user.company_id, month, year)
    
    return Response(
        content=ecr_text,
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=PF_ECR_{month}_{year}.txt"}
    )

@router.get("/esi-json")
async def download_esi_json(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Generates and returns ESI Monthly JSON for the company."""
    esi_json = ComplianceService.generate_esi_json(db, current_user.company_id, month, year)
    
    return Response(
        content=esi_json,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=ESI_Monthly_{month}_{year}.json"}
    )

@router.get("/pt-summary")
async def get_pt_summary(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns PT state-wise summary data."""
    return ComplianceService.generate_pt_summary(db, current_user.company_id, month, year)
