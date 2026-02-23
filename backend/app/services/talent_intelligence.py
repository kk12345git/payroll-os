from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.models.leave import LeaveApplication, LeaveStatus

class TalentIntelligenceService:
    @staticmethod
    async def get_attrition_risk_score(db: Session, employee_id: int) -> Dict[str, Any]:
        """
        Calculates an attrition risk score (0-100) for an employee.
        """
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return {"score": 0, "level": "Unknown", "factors": []}

        factors = []
        score = 0
        now = datetime.now()

        # 1. Attendance Consistency (last 90 days)
        ninety_days_ago = now - timedelta(days=90)
        attendance_count = db.query(func.count(Attendance.id)).filter(
            Attendance.employee_id == employee_id,
            Attendance.date >= ninety_days_ago.date(),
            Attendance.status == "Present"
        ).scalar() or 0
        
        # Assume 22 working days per month = 66 days in 90 days
        attendance_rate = (attendance_count / 66.0) * 100
        if attendance_rate < 80:
            risk_points = min(40, int((80 - attendance_rate) * 2))
            score += risk_points
            factors.append({
                "name": "Attendance Drop",
                "impact": "High",
                "description": f"Attendance rate dropped to {attendance_rate:.1f}% in the last 90 days."
            })

        # 2. Leave Spike (last 30 days)
        thirty_days_ago = now - timedelta(days=30)
        recent_leaves = db.query(func.sum(LeaveApplication.total_days)).filter(
            LeaveApplication.employee_id == employee_id,
            LeaveApplication.start_date >= thirty_days_ago.date(),
            LeaveApplication.status == LeaveStatus.APPROVED
        ).scalar() or 0

        if recent_leaves > 5:
            score += 20
            factors.append({
                "name": "Leave Spike",
                "impact": "Medium",
                "description": f"Applied for {recent_leaves} days of leave in the last 30 days."
            })

        # 3. Tenure Anniversary Risk
        if employee.joining_date:
            tenure_months = (now.date() - employee.joining_date).days // 30
            # Risk peaks near 12, 24, 36 months
            if any(abs(tenure_months - peak) <= 1 for peak in [11, 23, 35]):
                score += 15
                factors.append({
                    "name": "Tenure Milestone",
                    "impact": "Low",
                    "description": f"Employee is approaching a {tenure_months//12 + 1}-year anniversary."
                })

        # Cap score at 100
        score = min(score, 100)
        
        level = "Low"
        if score > 70:
            level = "Critical"
        elif score > 40:
            level = "Medium"
        
        return {
            "score": score,
            "level": level,
            "factors": factors,
            "employee_name": f"{employee.first_name} {employee.last_name}",
            "department": employee.department_id # In a real app, join with Department name
        }

    @staticmethod
    async def get_company_wide_risk(db: Session, company_id: int) -> List[Dict[str, Any]]:
        """
        Returns attrition risk for all employees in a company.
        """
        employees = db.query(Employee).filter(Employee.company_id == company_id).all()
        risk_reports = []
        for emp in employees:
            report = await TalentIntelligenceService.get_attrition_risk_score(db, emp.id)
            if report["score"] > 20: # Only report if there's actual risk
                risk_reports.append(report)
        
        return sorted(risk_reports, key=lambda x: x["score"], reverse=True)
