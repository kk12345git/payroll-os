from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from .talent import GigStatus

class GigBase(BaseModel):
    title: str
    description: str
    budget: Decimal = Decimal("0.0")
    required_skills: Optional[str] = None
    deadline: Optional[datetime] = None

class GigCreate(GigBase):
    pass

class GigResponse(GigBase):
    id: int
    company_id: int
    manager_id: int
    status: GigStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class GigApplicationBase(BaseModel):
    gig_id: int
    cover_letter: Optional[str] = None

class GigApplicationCreate(GigApplicationBase):
    pass

class GigApplicationResponse(GigApplicationBase):
    id: int
    employee_id: int
    status: str
    applied_at: datetime
    
    class Config:
        from_attributes = True
