from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from datetime import datetime

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.autopay_os import AutoPayOSRecord, AutoPayOSStatus
from app.models.attendance import Attendance
from app.models.leave import LeaveApplication, LeaveStatus
from app.schemas.autopay_os import AutoPayOSRecord as AutoPayOSRecordSchema

router = APIRouter()

@router.get("/dashboard")
def get_my_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    Returns personal dashboard data for the logged-in employee.
    """
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    # Get last payslip
    last_payslip = db.query(AutoPayOSRecord).filter(
        AutoPayOSRecord.employee_id == employee.id,
        AutoPayOSRecord.status == AutoPayOSStatus.PAID
    ).order_by(AutoPayOSRecord.year.desc(), AutoPayOSRecord.month.desc()).first()

    # Get recent attendance
    recent_attendance = db.query(Attendance).filter(
        Attendance.employee_id == employee.id
    ).order_by(Attendance.date.desc()).limit(5).all()

    # Get leave summary
    pending_leaves = db.query(LeaveApplication).filter(
        LeaveApplication.employee_id == employee.id,
        LeaveApplication.status == LeaveStatus.PENDING
    ).count()

    return {
        "employee": {
            "name": employee.full_name,
            "code": employee.employee_code,
            "designation": employee.designation
        },
        "stats": {
            "last_net_pay": float(last_payslip.net_pay) if last_payslip else 0,
            "pending_leaves": pending_leaves,
            "attendance_this_month": len(recent_attendance) # Simplified
        },
        "recent_activity": [
            {"type": "attendance", "date": a.date, "status": a.status} for a in recent_attendance
        ]
    }

@router.get("/payslips", response_model=List[AutoPayOSRecordSchema])
def get_my_payslips(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    Returns payslip history for the logged-in employee.
    """
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    return db.query(AutoPayOSRecord).filter(
        AutoPayOSRecord.employee_id == employee.id
    ).order_by(AutoPayOSRecord.year.desc(), AutoPayOSRecord.month.desc()).all()

@router.post("/apply-leave")
def apply_leave(
    leave_data: Any, # Using Any for quick implementation, should ideally use a schema
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    Submits a leave application for the logged-in employee.
    """
    employee = db.query(Employee).filter(Employee.user_id == current_user.id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")

    start_date = datetime.strptime(leave_data['start_date'], '%Y-%m-%d').date()
    end_date = datetime.strptime(leave_data['end_date'], '%Y-%m-%d').date()
    total_days = (end_date - start_date).days + 1

    db_leave = LeaveApplication(
        employee_id=employee.id,
        leave_type_id=leave_data['leave_type_id'],
        start_date=start_date,
        end_date=end_date,
        total_days=total_days,
        reason=leave_data['reason'],
        status=LeaveStatus.PENDING
    )
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    
    return {"message": "Leave application submitted successfully", "id": db_leave.id}
