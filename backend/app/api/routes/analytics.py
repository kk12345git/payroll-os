from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.services.forecast_service import ForecastService

router = APIRouter()

@app_router := APIRouter() # Workaround for router variable naming in prompt
@router.get("/forecast")
async def get_payroll_forecast(
    months: int = 6,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    Returns AI-driven cash flow projections for the next N months.
    """
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
        
    return ForecastService.get_cash_flow_forecast(db, current_user.company_id, months)
