from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.employee import Employee
from app.models.investment import InvestmentDeclaration, DeclarationStatus
from app.schemas.investment import (
    InvestmentDeclarationCreate, 
    InvestmentDeclarationResponse, 
    InvestmentDeclarationUpdate,
    DeclarationSummary
)

router = APIRouter()

@router.post("/me", response_model=InvestmentDeclarationResponse)
async def submit_declaration(
    declaration: InvestmentDeclarationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Allows an employee to submit a tax-saving investment declaration."""
    # Find employee record
    employee = db.query(Employee).filter(Employee.email == current_user.email).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found.")

    new_declaration = InvestmentDeclaration(
        employee_id=employee.id,
        company_id=employee.company_id,
        **declaration.model_dump()
    )
    
    db.add(new_declaration)
    db.commit()
    db.refresh(new_declaration)
    return new_declaration

@router.get("/me", response_model=List[InvestmentDeclarationResponse])
async def get_my_declarations(
    financial_year: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns all investment declarations for the current employee."""
    employee = db.query(Employee).filter(Employee.email == current_user.email).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found.")

    query = db.query(InvestmentDeclaration).filter(InvestmentDeclaration.employee_id == employee.id)
    if financial_year:
        query = query.filter(InvestmentDeclaration.financial_year == financial_year)
    
    return query.order_by(InvestmentDeclaration.created_at.desc()).all()

@router.get("/admin", response_model=List[InvestmentDeclarationResponse])
async def get_company_declarations(
    status: Optional[DeclarationStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Returns all investment declarations for the company."""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")

    query = db.query(InvestmentDeclaration).filter(InvestmentDeclaration.company_id == current_user.company_id)
    if status:
        query = query.filter(InvestmentDeclaration.status == status)
    
    return query.order_by(InvestmentDeclaration.created_at.desc()).all()

@router.patch("/admin/{declaration_id}", response_model=InvestmentDeclarationResponse)
async def review_declaration(
    declaration_id: int,
    update: InvestmentDeclarationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Approves or rejects an investment declaration."""
    declaration = db.query(InvestmentDeclaration).filter(
        InvestmentDeclaration.id == declaration_id,
        InvestmentDeclaration.company_id == current_user.company_id
    ).first()

    if not declaration:
        raise HTTPException(status_code=404, detail="Declaration not found.")

    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(declaration, field, value)
    
    if update.status:
        declaration.processed_at = func.now()

    db.commit()
    db.refresh(declaration)
    return declaration

@router.get("/me/summary", response_model=DeclarationSummary)
async def get_declaration_summary(
    financial_year: str = Query(..., description="e.g. 2025-26"),
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns a summary of declared vs accepted investments for the current employee."""
    employee = db.query(Employee).filter(Employee.email == current_user.email).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee profile not found.")

    stats = db.query(
        func.sum(InvestmentDeclaration.amount_declared),
        func.sum(InvestmentDeclaration.amount_accepted),
        func.count(InvestmentDeclaration.id)
    ).filter(
        InvestmentDeclaration.employee_id == employee.id,
        InvestmentDeclaration.financial_year == financial_year
    ).first()

    pending_count = db.query(func.count(InvestmentDeclaration.id)).filter(
        InvestmentDeclaration.employee_id == employee.id,
        InvestmentDeclaration.financial_year == financial_year,
        InvestmentDeclaration.status == DeclarationStatus.PENDING
    ).scalar() or 0

    return {
        "total_declared": stats[0] or 0,
        "total_accepted": stats[1] or 0,
        "pending_count": pending_count
    }
