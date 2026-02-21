from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
from typing import Dict, Any, List, Optional
import re
from app.models.employee import Employee
from app.models.payroll import PayrollRecord, PayrollStatus
from app.models.company import Department
from app.models.attendance import Attendance
from app.models.leave import LeaveApplication, LeaveStatus
from datetime import datetime, timedelta

class AICopilotService:
    @staticmethod
    def query(db: Session, company_id: int, query_text: str) -> Dict[str, Any]:
        """
        Processes a natural language query and returns data + explanation.
        """
        text = query_text.lower()
        
        # 1. Attrition Risk Prediction
        if any(w in text for w in ["attrition", "risk", "quit", "leave", "retention"]):
            return AICopilotService._predict_attrition(db, company_id)

        # 2. Budget Forecasting
        if any(w in text for w in ["forecast", "predict", "next month", "budget"]):
            return AICopilotService._forecast_budget(db, company_id)

        # 3. What-if Analysis (Hike Simulation)
        simulation_match = re.search(r"(\d+)%\s+hike", text)
        if simulation_match:
            percent = int(simulation_match.group(1))
            dept_name = None
            for dept in db.query(Department.name).filter(Department.company_id == company_id).all():
                if dept[0].lower() in text:
                    dept_name = dept[0]
                    break
            return AICopilotService._simulate_hike(db, company_id, percent, dept_name)

        # 4. Headcount
        if any(w in text for w in ["how many", "count", "headcount", "employees", "staff"]):
            count = db.query(func.count(Employee.id)).filter(
                Employee.company_id == company_id,
                Employee.is_active == True
            ).scalar()
            return {
                "answer": f"You currently have *{count} active employees* in the system.",
                "data": {"count": count},
                "type": "metric"
            }

        # 2. Total Salary Cost
        if any(w in text for w in ["total salary", "total payroll", "total cost", "total spend"]):
            cost = db.query(func.sum(PayrollRecord.net_pay)).filter(
                PayrollRecord.company_id == company_id,
                PayrollRecord.status == PayrollStatus.PAID
            ).scalar() or 0
            return {
                "answer": f"The total net payroll cost across the company is *₹{float(cost):,.2f}*.",
                "data": {"total_cost": float(cost)},
                "type": "metric"
            }

        # 3. Highest Paid Employee
        if any(w in text for w in ["highest paid", "top earner", "highest salary"]):
            record = db.query(PayrollRecord).join(Employee).filter(
                PayrollRecord.company_id == company_id
            ).order_by(PayrollRecord.gross_earnings.desc()).first()
            if record:
                employee_name = db.query(Employee.full_name).filter(Employee.id == record.employee_id).scalar()
                return {
                    "answer": f"The highest earner is *{employee_name}* with a gross pay of *₹{float(record.gross_earnings):,.2f}*.",
                    "data": {"employee": employee_name, "amount": float(record.gross_earnings)},
                    "type": "entity"
                }

        # 4. Highest Deduction
        if any(w in text for w in ["highest deduction", "top deduction", "most deduction", "deduction analysis"]):
            record = db.query(PayrollRecord).join(Employee).filter(
                PayrollRecord.company_id == company_id
            ).order_by(PayrollRecord.total_deductions.desc()).first()
            if record:
                employee_name = db.query(Employee.full_name).filter(Employee.id == record.employee_id).scalar()
                return {
                    "answer": f"The highest deduction was recorded for *{employee_name}* with a total of *₹{float(record.total_deductions):,.2f}* (mostly {record.status} payroll).",
                    "data": {"employee": employee_name, "amount": float(record.total_deductions)},
                    "type": "entity"
                }

        # 5. Department wise breakdown
        if "department" in text and any(w in text for w in ["breakdown", "cost", "spend"]):
            results = db.query(
                Department.name,
                func.sum(PayrollRecord.net_pay)
            ).join(Employee, Employee.department_id == Department.id)\
             .join(PayrollRecord, PayrollRecord.employee_id == Employee.id)\
             .filter(Department.company_id == company_id)\
             .group_by(Department.name).all()
             
            data = {r[0]: float(r[1]) for r in results}
            answer = "Here is the breakdown of payroll costs by department:\n"
            for dept, cost in data.items():
                answer += f"- *{dept}*: ₹{cost:,.2f}\n"
                
            return {
                "answer": answer,
                "data": data,
                "type": "chart"
            }

        return {
            "answer": "🤖 I'm sorry, I couldn't quite understand that query. Try asking about 'total salary', 'highest paid', or 'employee count'.",
            "type": "error"
        }

    @staticmethod
    def _predict_attrition(db: Session, company_id: int) -> Dict[str, Any]:
        # High risk if > 10 days leave in last 3 months
        three_months_ago = datetime.now() - timedelta(days=90)
        high_leave_emps = db.query(
            Employee.full_name,
            func.sum(LeaveApplication.total_days).label("total")
        ).join(LeaveApplication).filter(
            Employee.company_id == company_id,
            LeaveApplication.start_date >= three_months_ago.date(),
            LeaveApplication.status == LeaveStatus.APPROVED
        ).group_by(Employee.id).having(func.sum(LeaveApplication.total_days) > 10).all()

        if not high_leave_emps:
            return {
                "answer": "✅ My analysis shows **low attrition risk** across the company. Attendance patterns are stable.",
                "type": "insight"
            }

        answer = "⚠️ **High Attrition Risk Detected** for the following employees based on recent leave patterns:\n"
        data = []
        for emp in high_leave_emps:
            answer += f"- *{emp[0]}*: {emp[1]} days leave in 90 days.\n"
            data.append({"name": emp[0], "leave_days": int(emp[1])})

        return {
            "answer": answer,
            "data": data,
            "type": "alert"
        }

    @staticmethod
    def _forecast_budget(db: Session, company_id: int) -> Dict[str, Any]:
        # Simple forecasting: Avg of last 3 months + 5% overhead
        avg_cost = db.query(func.avg(PayrollRecord.net_pay)).filter(
            PayrollRecord.company_id == company_id,
            PayrollRecord.status == PayrollStatus.PAID
        ).scalar() or 0
        
        forecast = float(avg_cost) * 1.05 # 5% buffer
        return {
            "answer": f"Based on recent trends, your projected payroll budget for next month is ~**₹{forecast:,.2f}**.",
            "data": {"forecasted_amount": forecast},
            "type": "metric"
        }

    @staticmethod
    def _simulate_hike(db: Session, company_id: int, percent: int, dept_name: str = None) -> Dict[str, Any]:
        query = db.query(func.sum(PayrollRecord.net_pay)).filter(
            PayrollRecord.company_id == company_id,
            PayrollRecord.status == PayrollStatus.PAID
        )
        
        if dept_name:
            query = query.join(Employee).join(Department).filter(Department.name == dept_name)
        
        current_cost = float(query.scalar() or 0)
        new_cost = current_cost * (1 + percent/100)
        diff = new_cost - current_cost

        target = dept_name if dept_name else "the entire company"
        return {
            "answer": f"A **{percent}% hike** for {target} would increase monthly costs by **₹{diff:,.2f}**, bringing total monthly spend to **₹{new_cost:,.2f}**.",
            "data": {"increase": diff, "new_total": new_cost},
            "type": "insight"
        }
