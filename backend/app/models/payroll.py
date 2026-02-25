from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class SalaryStructure(Base):
    __tablename__ = "salary_structures"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, unique=True)
    
    # Earnings (Monthly)
    basic = Column(Numeric(precision=15, scale=2), nullable=False)
    hra = Column(Numeric(precision=15, scale=2), nullable=False)
    conveyance = Column(Numeric(precision=15, scale=2), default=0)
    medical_allowance = Column(Numeric(precision=15, scale=2), default=0)
    special_allowance = Column(Numeric(precision=15, scale=2), default=0)
    
    # Statutory Options
    pf_enabled = Column(Boolean, default=True)
    esi_enabled = Column(Boolean, default=True)
    pt_enabled = Column(Boolean, default=True)
    tds_enabled = Column(Boolean, default=True)
    employer_pf_enabled = Column(Boolean, default=True)
    employer_esi_enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("Employee", back_populates="salary_structure")


class AutoPayOSStatus(str, enum.Enum):
    DRAFT = "draft"
    PROCESSED = "processed"
    PAID = "paid"
    CANCELLED = "cancelled"


class AutoPayOSRecord(Base):
    __tablename__ = "payroll_records"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    month = Column(Integer, nullable=False) # 1-12
    year = Column(Integer, nullable=False)
    
    # Attendance Data for the month
    paid_days = Column(Numeric(precision=5, scale=2), default=0)
    absent_days = Column(Numeric(precision=5, scale=2), default=0)
    
    # Pay totals
    gross_earnings = Column(Numeric(precision=15, scale=2), nullable=False)
    total_deductions = Column(Numeric(precision=15, scale=2), nullable=False)
    net_pay = Column(Numeric(precision=15, scale=2), nullable=False)
    
    # Component breakdown (Earned values after attendance/leaves)
    basic_earned = Column(Numeric(precision=15, scale=2))
    hra_earned = Column(Numeric(precision=15, scale=2))
    conveyance_earned = Column(Numeric(precision=15, scale=2))
    medical_earned = Column(Numeric(precision=15, scale=2))
    special_earned = Column(Numeric(precision=15, scale=2))
    pf_deduction = Column(Numeric(precision=15, scale=2))
    esi_deduction = Column(Numeric(precision=15, scale=2))
    pt_deduction = Column(Numeric(precision=15, scale=2))
    income_tax_deduction = Column(Numeric(precision=15, scale=2))
    employer_pf_contribution = Column(Numeric(precision=15, scale=2))
    employer_esi_contribution = Column(Numeric(precision=15, scale=2))
    
    status = Column(SQLEnum(AutoPayOSStatus), default=AutoPayOSStatus.DRAFT)
    processed_at = Column(DateTime(timezone=True))
    paid_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("Employee", back_populates="payroll_records")
