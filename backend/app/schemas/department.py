from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str
    code: Optional[str] = None
    budget: float = 0
    manager_id: Optional[int] = None
    company_id: int

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    budget: Optional[float] = None
    manager_id: Optional[int] = None

class Department(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
