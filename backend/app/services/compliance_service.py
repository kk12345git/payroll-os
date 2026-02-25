from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any, Optional
import io
import json
from datetime import datetime
from decimal import Decimal

from app.models.employee import Employee
from app.models.payroll import AutoPayOSRecord, AutoPayOSStatus

class ComplianceService:
    @staticmethod
    def generate_pf_ecr(db: Session, company_id: int, month: int, year: int) -> str:
        """
        Generates the PF ECR (Electronic Challan-cum-Return) 2.0 text file.
        Separator: #~#
        """
        records = db.query(AutoPayOSRecord).join(Employee).filter(
            AutoPayOSRecord.company_id == company_id,
            AutoPayOSRecord.month == month,
            AutoPayOSRecord.year == year,
            AutoPayOSRecord.status == AutoPayOSStatus.PAID,
            Employee.uan_number.isnot(None)
        ).all()

        output = io.StringIO()
        
        for record in records:
            emp = record.employee
            # PF logic: 
            # EPF Wages = Basic (capped at 15000 or actual based on policy, we use earned basic)
            epf_wages = float(record.basic_earned)
            eps_wages = min(epf_wages, 15000.0) # EPS is usually capped at 15k
            edli_wages = eps_wages
            
            # Contributions
            epf_contribution = float(record.pf_deduction or 0)
            eps_contribution = float(record.employer_pf_contribution or 0) * (8.33 / 12) # Approximation of EPS portion
            # In real ECR, we need precise rounded values:
            eps_cont_rounded = round(eps_wages * 0.0833)
            epf_eps_diff = epf_contribution - eps_cont_rounded
            
            # Row Construction: UAN#~#MEMBER_NAME#~#GROSS#~#EPF#~#EPS#~#EDLI#~#EPF_CONT#~#EPS_CONT#~#DIFF#~#NCP#~#REFUND
            row = [
                emp.uan_number,
                emp.full_name,
                f"{float(record.gross_earnings):.0f}",
                f"{epf_wages:.0f}",
                f"{eps_wages:.0f}",
                f"{edli_wages:.0f}",
                f"{epf_contribution:.0f}",
                f"{eps_cont_rounded:.0f}",
                f"{max(0, epf_eps_diff):.0f}",
                f"{float(record.absent_days):.0f}",
                "0" # Refund of advances
            ]
            output.write("#~#".join(row) + "\n")
            
        return output.getvalue()

    @staticmethod
    def generate_esi_json(db: Session, company_id: int, month: int, year: int) -> str:
        """
        Generates the ESI monthly contribution data in JSON format for the ESIC portal.
        """
        records = db.query(AutoPayOSRecord).join(Employee).filter(
            AutoPayOSRecord.company_id == company_id,
            AutoPayOSRecord.month == month,
            AutoPayOSRecord.year == year,
            AutoPayOSRecord.status == AutoPayOSStatus.PAID,
            Employee.esi_number.isnot(None)
        ).all()

        esi_data = []
        for record in records:
            emp = record.employee
            total_days_in_month = 30 # Simplified
            working_days = float(record.paid_days)
            
            esi_data.append({
                "IpNumber": emp.esi_number,
                "IpName": emp.full_name,
                "NoOfDaysForWhichWagesPaid": working_days,
                "TotalMonthlyWages": float(record.gross_earnings),
                "ReasonForZeroWorkingDays": "0" if working_days > 0 else "1", # 1=Leave without pay
                "LastWorkingDay": ""
            })
            
        return json.dumps(esi_data, indent=2)

    @staticmethod
    def generate_pt_summary(db: Session, company_id: int, month: int, year: int) -> List[Dict[str, Any]]:
        """
        Generates a state-wise Professional Tax summary.
        """
        results = db.query(
            Employee.state,
            func.count(Employee.id).label("emp_count"),
            func.sum(AutoPayOSRecord.pt_deduction).label("total_pt")
        ).join(AutoPayOSRecord, AutoPayOSRecord.employee_id == Employee.id)\
         .filter(
             AutoPayOSRecord.company_id == company_id,
             AutoPayOSRecord.month == month,
             AutoPayOSRecord.year == year,
             AutoPayOSRecord.pt_deduction > 0
         ).group_by(Employee.state).all()

        return [
            {"state": r[0], "headcount": r[1], "amount": float(r[2])}
            for r in results
        ]
