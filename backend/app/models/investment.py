from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class DeclarationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class InvestmentCategory(str, enum.Enum):
    SECTION_80C = "80C"
    SECTION_80D = "80D"
    SECTION_80CCD = "80CCD"
    SECTION_80G = "80G"
    HRA = "HRA"
    LTA = "LTA"
    OTHER = "OTHER"

class InvestmentDeclaration(Base):
    __tablename__ = "investment_declarations"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    financial_year = Column(String, nullable=False) # e.g., "2025-26"
    
    category = Column(SQLEnum(InvestmentCategory), nullable=False)
    sub_category = Column(String) # e.g., "Life Insurance", "ELSS", "Rent Paid"
    
    amount_declared = Column(Numeric(precision=15, scale=2), nullable=False)
    amount_accepted = Column(Numeric(precision=15, scale=2), default=0)
    
    proof_url = Column(String) # URL to uploaded document
    remarks = Column(String)
    admin_remarks = Column(String)
    
    status = Column(SQLEnum(DeclarationStatus), default=DeclarationStatus.PENDING)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    employee = relationship("Employee")
