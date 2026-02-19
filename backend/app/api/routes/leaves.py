from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.leave import LeaveApplication, LeaveType, LeaveStatus
from app.schemas.leave import LeaveApplicationCreate, LeaveApplicationUpdate, LeaveApplication as LeaveSchema, LeaveType as LeaveTypeSchema
from app.api import dependencies
from app.models.user import UserRole, User

router = APIRouter()

@router.get("/types", response_model=List[LeaveTypeSchema])
def read_leave_types(db: Session = Depends(get_db)):
    return db.query(LeaveType).all()

@router.get("/", response_model=List[LeaveSchema])
def read_leaves(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    if current_user.role in [UserRole.ADMIN, UserRole.HR_MANAGER]:
        return db.query(LeaveApplication).all()
    # For employees, we would typically filter by their employee record linked to user
    return db.query(LeaveApplication).all() # Simple implementation for now

@router.post("/", response_model=LeaveSchema)
def apply_leave(
    leave: LeaveApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    db_leave = LeaveApplication(**leave.model_dump(), status=LeaveStatus.PENDING)
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave

@router.put("/{leave_id}/approve", response_model=LeaveSchema)
def approve_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    db_leave = db.query(LeaveApplication).filter(LeaveApplication.id == leave_id).first()
    if not db_leave:
        raise HTTPException(status_code=404, detail="Leave application not found")
    
    db_leave.status = LeaveStatus.APPROVED
    db_leave.approved_by_id = current_user.id
    db.commit()
    db.refresh(db_leave)
    return db_leave

@router.put("/{leave_id}/reject", response_model=LeaveSchema)
def reject_leave(
    leave_id: int,
    rejection_data: LeaveApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    db_leave = db.query(LeaveApplication).filter(LeaveApplication.id == leave_id).first()
    if not db_leave:
        raise HTTPException(status_code=404, detail="Leave application not found")
    
    db_leave.status = LeaveStatus.REJECTED
    db_leave.rejection_reason = rejection_data.rejection_reason
    db.commit()
    db.refresh(db_leave)
    return db_leave
