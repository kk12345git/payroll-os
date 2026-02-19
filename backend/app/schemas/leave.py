from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from app.models.leave import LeaveStatus

class LeaveTypeBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    is_paid: bool = True
    annual_limit: int = 0

class LeaveTypeCreate(LeaveTypeBase):
    pass

class LeaveType(LeaveTypeBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class LeaveApplicationBase(BaseModel):
    leave_type_id: int
    start_date: date
    end_date: date
    total_days: int
    reason: str

class LeaveApplicationCreate(LeaveApplicationBase):
    employee_id: int

class LeaveApplicationUpdate(BaseModel):
    status: Optional[LeaveStatus] = None
    rejection_reason: Optional[str] = None

class LeaveApplication(LeaveApplicationBase):
    id: int
    employee_id: int
    status: LeaveStatus
    approved_by_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
