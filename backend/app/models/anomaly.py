from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class AnomalySeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AnomalyType(str, enum.Enum):
    SALARY_SPIKE = "salary_spike"
    COMPLIANCE_MISMATCH = "compliance_mismatch"
    GHOST_EMPLOYEE = "ghost_employee"
    TAX_ANOMALY = "tax_anomaly"
    DEDUCTION_ERROR = "deduction_error"

class Anomaly(Base):
    __tablename__ = "anomalies"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    payroll_record_id = Column(Integer, ForeignKey("payroll_records.id"), nullable=True)
    
    type = Column(SQLEnum(AnomalyType), nullable=False)
    severity = Column(SQLEnum(AnomalySeverity), default=AnomalySeverity.LOW)
    title = Column(String, nullable=False)
    description = Column(String)
    data = Column(JSON) # Store specific details like "old_value", "new_value"
    
    is_resolved = Column(Boolean, default=False)
    resolved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolution_notes = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    company = relationship("Company")
    employee = relationship("Employee")
    payroll_record = relationship("AutoPayOSRecord")
