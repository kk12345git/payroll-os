from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.core.database import get_db
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate, Attendance as AttendanceSchema, AttendanceBulkItem
from app.api import dependencies
from app.models.user import UserRole
from app.models.employee import Employee

router = APIRouter()

@router.get("/", response_model=List[AttendanceSchema])
def read_attendance(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    employee_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.get_current_user)
):
    query = db.query(Attendance)
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    if employee_id:
        query = query.filter(Attendance.employee_id == employee_id)
    
    return query.all()

@router.post("/", response_model=AttendanceSchema)
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    # Check if entry already exists for this employee and date
    db_entry = db.query(Attendance).filter(
        Attendance.employee_id == attendance.employee_id,
        Attendance.date == attendance.date
    ).first()
    
    if db_entry:
        # Update existing entry
        update_data = attendance.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_entry, key, value)
        db.commit()
        db.refresh(db_entry)
        return db_entry
    
    db_attendance = Attendance(**attendance.model_dump())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

@router.post("/bulk", status_code=status.HTTP_201_CREATED)
def bulk_mark_attendance(
    items: List[AttendanceBulkItem],
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    for item in items:
        employee = db.query(Employee).filter(Employee.employee_id == item.employee_code).first() # Assuming employee_code maps to employee_id for now or fix logic
        if not employee:
            continue
        
        db_entry = db.query(Attendance).filter(
            Attendance.employee_id == employee.id,
            Attendance.date == item.date
        ).first()
        
        if db_entry:
            db_entry.check_in = item.check_in
            db_entry.check_out = item.check_out
            db_entry.status = item.status
        else:
            db_entry = Attendance(
                employee_id=employee.id,
                date=item.date,
                check_in=item.check_in,
                check_out=item.check_out,
                status=item.status
            )
            db.add(db_entry)
            
    db.commit()
    return {"message": "Bulk attendance updated successfully"}
