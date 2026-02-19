from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Any, Dict
from pydantic import BaseModel

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.services.tax_optimizer import TaxOptimizerService
from app.models.employee import Employee

router = APIRouter()

class TaxSuggestion(BaseModel):
    category: str
    title: str
    description: str
    potential_saving: float

class TaxOptimizationResponse(BaseModel):
    current_tax: float
    optimized_tax: float
    potential_annual_savings: float
    recommended_regime: str
    suggestions: List[TaxSuggestion]
    simulations: Dict[str, float]

@router.get("/analyze", response_model=TaxOptimizationResponse)
async def analyze_tax(
    current_regime: str = "new",
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    AI-driven analysis of the current user's tax liability and saving opportunities.
    """
    # Find employee record
    employee = db.query(Employee).filter(Employee.email == current_user.email).first()
    
    if not employee:
         raise HTTPException(status_code=404, detail="Employee profile not found.")
         
    if not employee.salary_structure:
         raise HTTPException(status_code=400, detail="Salary structure not assigned. Cannot calculate tax.")
         
    return TaxOptimizerService.optimize_tax(employee.salary_structure, current_regime)
