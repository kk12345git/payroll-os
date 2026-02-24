from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.services.talent_intelligence import TalentIntelligenceService

from app.models.talent import Gig, GigApplication, GigStatus
from app.schemas.talent import GigCreate, GigResponse, GigApplicationCreate, GigApplicationResponse

router = APIRouter()

@router.get("/attrition-risk", response_model=List[Dict[str, Any]])
async def get_company_attrition_risk(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Returns attrition risk reports for all employees in the company."""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
    
    return await TalentIntelligenceService.get_company_wide_risk(db, current_user.company_id)

@router.get("/attrition-risk/{employee_id}", response_model=Dict[str, Any])
async def get_employee_attrition_risk(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Returns a detailed attrition risk report for a specific employee."""
    return await TalentIntelligenceService.get_attrition_risk_score(db, employee_id)

# --- Internal Gig Marketplace ---

@router.get("/gigs", response_model=List[GigResponse])
async def list_gigs(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """List all open gigs for the current company."""
    return db.query(Gig).filter(
        Gig.company_id == current_user.company_id,
        Gig.status == GigStatus.OPEN
    ).all()

@router.post("/gigs", response_model=GigResponse)
async def create_gig(
    gig_data: GigCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Post a new internal gig (Admin/Manager only)."""
    new_gig = Gig(
        **gig_data.model_dump(),
        company_id=current_user.company_id,
        manager_id=current_user.id
    )
    db.add(new_gig)
    db.commit()
    db.refresh(new_gig)
    return new_gig

@router.post("/gigs/apply", response_model=GigApplicationResponse)
async def apply_to_gig(
    app_data: GigApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Apply for an internal gig."""
    # In a real app, find the employee record linked to the user
    from app.models.employee import Employee
    employee = db.query(Employee).filter(Employee.company_id == current_user.company_id).first()
    
    new_app = GigApplication(
        **app_data.model_dump(),
        employee_id=employee.id
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app
