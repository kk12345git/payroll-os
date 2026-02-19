from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime

from app.core.database import get_db
from app.api import dependencies
from app.models.ewa import EWAWithdrawal, EWAStatus
from app.services.ewa_service import EWAService
from app.models.user import User, UserRole

router = APIRouter()

class EWABalanceResponse(BaseModel):
    earned: float
    withdrawn: float
    available: float
    paid_days: float
    daily_rate: float

class EWARequest(BaseModel):
    amount: Decimal
    notes: Optional[str] = None

class EWAWithdrawalResponse(BaseModel):
    id: int
    amount: Decimal
    status: EWAStatus
    requested_at: datetime
    notes: Optional[str]
    
    class Config:
        from_attributes = True

@router.get("/balance", response_model=EWABalanceResponse)
async def get_ewa_balance(
    current_user: User = Depends(dependencies.get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve the current available early wage balance for the employee."""
    # Note: For now, we assume the user is also an employee if they have an employee record.
    # In a real system, we'd link User to Employee more explicitly if they are the same person.
    # For this demo, we'll try to find an employee record with the same email or link.
    from app.models.employee import Employee
    employee = db.query(Employee).filter(Employee.email == current_user.email).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee record not found for this user")
    
    return EWAService.calculate_available_balance(db, employee.id)

@router.post("/request", response_model=EWAWithdrawalResponse)
async def request_ewa_withdrawal(
    request_data: EWARequest,
    current_user: User = Depends(dependencies.get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a request for early wage withdrawal."""
    from app.models.employee import Employee
    employee = db.query(Employee).filter(Employee.email == current_user.email).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee record not found for this user")
    
    try:
        withdrawal = EWAService.request_withdrawal(
            db, 
            employee.id, 
            current_user.company_id, 
            request_data.amount
        )
        return withdrawal
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/history", response_model=List[EWAWithdrawalResponse])
async def get_ewa_history(
    current_user: User = Depends(dependencies.get_current_user),
    db: Session = Depends(get_db)
):
    """Get withdrawal history for the current employee."""
    from app.models.employee import Employee
    employee = db.query(Employee).filter(Employee.email == current_user.email).first()
    
    if not employee:
        return []
        
    return db.query(EWAWithdrawal).filter(
        EWAWithdrawal.employee_id == employee.id
    ).order_by(EWAWithdrawal.requested_at.desc()).all()

@router.get("/pending", response_model=List[EWAWithdrawalResponse])
async def get_pending_ewa(
    current_user: User = Depends(dependencies.require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Get all pending EWA requests for the company (Admin only)."""
    return db.query(EWAWithdrawal).filter(
        EWAWithdrawal.company_id == current_user.company_id,
        EWAWithdrawal.status == EWAStatus.PENDING
    ).order_by(EWAWithdrawal.requested_at.asc()).all()

@router.post("/{withdrawal_id}/action")
async def action_ewa_withdrawal(
    withdrawal_id: int,
    action: str, # 'approve' or 'reject'
    current_user: User = Depends(dependencies.require_role(UserRole.ADMIN)),
    db: Session = Depends(get_db)
):
    """Approve or reject an EWA withdrawal request."""
    withdrawal = db.query(EWAWithdrawal).filter(
        EWAWithdrawal.id == withdrawal_id,
        EWAWithdrawal.company_id == current_user.company_id
    ).first()
    
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal request not found")
    
    if action == "approve":
        withdrawal.status = EWAStatus.APPROVED
    elif action == "reject":
        withdrawal.status = EWAStatus.REJECTED
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    withdrawal.processed_at = datetime.now()
    withdrawal.processed_by_id = current_user.id
    db.commit()
    
    return {"status": withdrawal.status}
