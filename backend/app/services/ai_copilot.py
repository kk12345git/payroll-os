from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
from typing import Dict, Any, List, Optional
import re
from app.models.employee import Employee
from app.models.payroll import PayrollRecord, PayrollStatus
from app.models.company import Department

class AICopilotService:
    @staticmethod
    def query(db: Session, company_id: int, query_text: str) -> Dict[str, Any]:
        """
        Processes a natural language query and returns data + explanation.
        """
        text = query_text.lower()
        
        # 1. Headcount (Moved to top for priority)
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

        # 4. Department wise breakdown
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
