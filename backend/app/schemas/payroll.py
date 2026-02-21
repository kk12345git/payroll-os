from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.payroll import PayrollStatus

class SalaryStructureBase(BaseModel):
    basic: Decimal
    hra: Decimal
    conveyance: Decimal = Decimal("0.0")
    medical_allowance: Decimal = Decimal("0.0")
    special_allowance: Decimal = Decimal("0.0")
    pf_enabled: bool = True
    esi_enabled: bool = True
    pt_enabled: bool = True
    tds_enabled: bool = True
    employer_pf_enabled: bool = True
    employer_esi_enabled: bool = True

class SalaryStructureCreate(SalaryStructureBase):
    employee_id: int

class SalaryStructureUpdate(BaseModel):
    basic: Optional[Decimal] = None
    hra: Optional[Decimal] = None
    conveyance: Optional[Decimal] = None
    medical_allowance: Optional[Decimal] = None
    special_allowance: Optional[Decimal] = None
    pf_enabled: Optional[bool] = None
    esi_enabled: Optional[bool] = None
    pt_enabled: Optional[bool] = None
    tds_enabled: Optional[bool] = None
    employer_pf_enabled: Optional[bool] = None
    employer_esi_enabled: Optional[bool] = None

class SalaryStructure(SalaryStructureBase):
    id: int
    employee_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class PayrollRecordBase(BaseModel):
    month: int
    year: int
    paid_days: Decimal
    absent_days: Decimal
    gross_earnings: Decimal
    total_deductions: Decimal
    net_pay: Decimal
    basic_earned: Decimal
    hra_earned: Decimal
    conveyance_earned: Decimal
    medical_earned: Decimal
    special_earned: Decimal
    pf_deduction: Decimal
    esi_deduction: Decimal
    pt_deduction: Decimal
    income_tax_deduction: Decimal
    employer_pf_contribution: Decimal = Decimal("0.0")
    employer_esi_contribution: Decimal = Decimal("0.0")
    status: PayrollStatus = PayrollStatus.DRAFT

class PayrollSummary(BaseModel):
    month: int
    year: int
    total_gross: Decimal
    total_net: Decimal
    employee_count: int
    status: str

class PayrollRecord(PayrollRecordBase):
    id: int
    employee_id: int
    processed_at: Optional[datetime] = None
    paid_at: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class PayrollProcessRequest(BaseModel):
    employee_ids: List[int]
    month: int
    year: int

class PayrollSummary(BaseModel):
    total_employees: int
    total_gross: Decimal
    total_deductions: Decimal
    total_net: Decimal
    status: str
