from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class EWAStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    DISBURSED = "disbursed"
    SETTLED = "settled" # Settled means it was deducted from the final autopay_os

class EWAWithdrawal(Base):
    __tablename__ = "ewa_withdrawals"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    amount = Column(Numeric(precision=15, scale=2), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    
    status = Column(SQLEnum(EWAStatus), default=EWAStatus.PENDING)
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    processed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    notes = Column(String)
    
    # Relationships
    employee = relationship("Employee")
    company = relationship("Company")
