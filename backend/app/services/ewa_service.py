from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, datetime
from decimal import Decimal
import calendar

from app.models.employee import Employee
from app.models.attendance import Attendance
from app.models.autopay_os import SalaryStructure
from app.models.ewa import EWAWithdrawal, EWAStatus

class EWAService:
    @staticmethod
    def calculate_available_balance(db: Session, employee_id: int) -> dict:
        """
        Calculates how much an employee can withdraw early.
        Formula: (Earned Salary so far * 0.5) - Already Withdrawn
        """
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee or not employee.salary_structure:
            return {"available": 0, "earned": 0, "limit": 0.5}

        structure = employee.salary_structure
        monthly_gross = structure.basic + structure.hra + structure.conveyance + \
                        structure.medical_allowance + structure.special_allowance

        # Get current month/year
        today = date.today()
        month = today.month
        year = today.year
        _, days_in_month = calendar.monthrange(year, month)

        # Get attendance so far
        start_of_month = date(year, month, 1)
        attendance_records = db.query(Attendance).filter(
            Attendance.employee_id == employee_id,
            Attendance.date >= start_of_month,
            Attendance.date <= today
        ).all()

        # Calculate paid days so far (including leaves and half days)
        present_count = sum(1 for a in attendance_records if a.status == 'present')
        half_day_count = sum(Decimal("0.5") for a in attendance_records if a.status == 'half-day')
        leave_count = sum(1 for a in attendance_records if a.status == 'leave')
        
        paid_days_so_far = Decimal(present_count) + half_day_count + Decimal(leave_count)
        
        # Earned amount so far
        daily_rate = monthly_gross / Decimal(days_in_month)
        earned_so_far = daily_rate * paid_days_so_far
        
        # Get already withdrawn amount this month
        withdrawn_this_month = db.query(func.sum(EWAWithdrawal.amount)).filter(
            EWAWithdrawal.employee_id == employee_id,
            EWAWithdrawal.month == month,
            EWAWithdrawal.year == year,
            EWAWithdrawal.status != EWAStatus.REJECTED
        ).scalar() or Decimal("0.0")

        # Allow up to 50% of earned amount
        total_limit = earned_so_far * Decimal("0.5")
        available = max(Decimal("0.0"), total_limit - withdrawn_this_month)

        return {
            "earned": float(earned_so_far),
            "withdrawn": float(withdrawn_this_month),
            "available": float(available),
            "paid_days": float(paid_days_so_far),
            "daily_rate": float(daily_rate)
        }

    @staticmethod
    def request_withdrawal(db: Session, employee_id: int, company_id: int, amount: Decimal) -> EWAWithdrawal:
        balance = EWAService.calculate_available_balance(db, employee_id)
        
        if amount > Decimal(str(balance["available"])):
            raise ValueError(f"Withdrawal amount ₹{amount} exceeds available balance ₹{balance['available']}")

        now = datetime.now()
        withdrawal = EWAWithdrawal(
            employee_id=employee_id,
            company_id=company_id,
            amount=amount,
            month=now.month,
            year=now.year,
            status=EWAStatus.PENDING,
            requested_at=now
        )
        
        db.add(withdrawal)
        db.commit()
        db.refresh(withdrawal)
        return withdrawal
