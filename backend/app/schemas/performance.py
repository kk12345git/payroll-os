from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from app.models.performance import GoalStatus

class OKRBase(BaseModel):
    title: str
    description: Optional[str] = None
    target_value: float = 100.0
    unit: str = "%"
    due_date: Optional[date] = None

class OKRCreate(OKRBase):
    employee_id: int

class OKRUpdate(BaseModel):
    current_value: Optional[float] = None
    status: Optional[GoalStatus] = None

class OKRResponse(OKRBase):
    id: int
    employee_id: int
    current_value: float
    status: GoalStatus
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackBase(BaseModel):
    period: str
    rating: int = Field(..., ge=1, le=5)
    comments: str
    strengths: Optional[str] = None
    improvements: Optional[str] = None
    is_anonymous: bool = False

class FeedbackCreate(FeedbackBase):
    employee_id: int

class FeedbackResponse(FeedbackBase):
    id: int
    employee_id: int
    reviewer_id: int
    is_finalized: bool
    created_at: datetime

    class Config:
        from_attributes = True
