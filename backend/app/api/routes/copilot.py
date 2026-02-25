from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Any, Dict

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.services.ai_copilot import AICopilotService

router = APIRouter()

class CopilotQuery(BaseModel):
    query: str

@router.post("/query")
async def ask_copilot(
    payload: CopilotQuery,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    Experimental: Natural language interface for autopay_os data.
    """
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
        
    return AICopilotService.query(db, current_user.company_id, payload.query)
