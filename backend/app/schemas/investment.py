from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from app.models.investment import InvestmentCategory, DeclarationStatus

class InvestmentDeclarationBase(BaseModel):
    category: InvestmentCategory
    sub_category: str
    amount_declared: Decimal
    financial_year: str
    remarks: Optional[str] = None

class InvestmentDeclarationCreate(InvestmentDeclarationBase):
    proof_url: Optional[str] = None

class InvestmentDeclarationUpdate(BaseModel):
    amount_accepted: Optional[Decimal] = None
    admin_remarks: Optional[str] = None
    status: Optional[DeclarationStatus] = None

class InvestmentDeclarationResponse(InvestmentDeclarationBase):
    id: int
    employee_id: int
    amount_accepted: Decimal
    proof_url: Optional[str] = None
    admin_remarks: Optional[str] = None
    status: DeclarationStatus
    created_at: datetime
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DeclarationSummary(BaseModel):
    total_declared: Decimal
    total_accepted: Decimal
    pending_count: int
