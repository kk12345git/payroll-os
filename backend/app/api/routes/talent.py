from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.services.talent_intelligence import TalentIntelligenceService

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
    # In a real app, verify that the employee belongs to the current user's company
    return await TalentIntelligenceService.get_attrition_risk_score(db, employee_id)
