from app.core.database import Base
from app.models.user import User, UserRole
from app.models.company import Company, Department
from app.models.employee import Employee, Gender, MaritalStatus
from app.models.attendance import Attendance
from app.models.leave import LeaveType, LeaveApplication, LeaveStatus
from app.models.autopay_os import SalaryStructure, AutoPayOSRecord, AutoPayOSStatus

# Import all models here so Alembic can discover them
__all__ = [
    "Base",
    "User",
    "UserRole",
    "Company",
    "Department",
    "Employee",
    "Gender",
    "MaritalStatus",
    "Attendance",
    "LeaveType",
    "LeaveApplication",
    "LeaveStatus",
    "SalaryStructure",
    "AutoPayOSRecord",
    "AutoPayOSStatus",
]
