from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date, datetime

class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    date_of_joining: date
    designation: str
    department_id: int
    company_id: int
    pan_number: Optional[str] = None
    aadhaar_number: Optional[str] = None
    uan_number: Optional[str] = None
    esi_number: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc_code: Optional[str] = None
    bank_name: Optional[str] = None
    tax_regime: str = "new"
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    date_of_joining: Optional[date] = None
    designation: Optional[str] = None
    department_id: Optional[int] = None
    pan_number: Optional[str] = None
    aadhaar_number: Optional[str] = None
    uan_number: Optional[str] = None
    esi_number: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc_code: Optional[str] = None
    bank_name: Optional[str] = None
    tax_regime: Optional[str] = None
    is_active: Optional[bool] = None

class Employee(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
