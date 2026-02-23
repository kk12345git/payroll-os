from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.models.lifecycle import LifecycleType, TaskStatus

class LifecycleTaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: LifecycleType
    due_date: Optional[date] = None

class LifecycleTaskCreate(LifecycleTaskBase):
    employee_id: int
    assigned_to_id: Optional[int] = None

class LifecycleTaskUpdate(BaseModel):
    status: Optional[TaskStatus] = None
    completed_at: Optional[datetime] = None
    assigned_to_id: Optional[int] = None

class LifecycleTaskResponse(LifecycleTaskBase):
    id: int
    employee_id: int
    assigned_to_id: Optional[int] = None
    status: TaskStatus
    completed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class OffboardingBase(BaseModel):
    resignation_date: date
    last_working_day: date
    reason: Optional[str] = None

class OffboardingCreate(OffboardingBase):
    employee_id: int
    notice_period_days: Optional[int] = 30

class OffboardingResponse(OffboardingBase):
    id: int
    employee_id: int
    notice_period_days: int
    final_settlement_status: str
    is_cleared: bool
    created_at: datetime

    class Config:
        from_attributes = True
