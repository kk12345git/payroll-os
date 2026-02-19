from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class LeaveStatus(str, enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    CANCELLED = "Cancelled"

class LeaveType(Base):
    __tablename__ = "leave_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Casual, Sick, Earned, etc.
    code = Column(String, unique=True, nullable=False)
    description = Column(String)
    is_paid = Column(Boolean, default=True)
    annual_limit = Column(Integer, default=0)
    
    # Relationships
    leave_applications = relationship("LeaveApplication", back_populates="leave_type")

class LeaveApplication(Base):
    __tablename__ = "leave_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    status = Column(SQLEnum(LeaveStatus), default=LeaveStatus.PENDING)
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    rejection_reason = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("Employee", back_populates="leave_applications")
    leave_type = relationship("LeaveType", back_populates="leave_applications")
    approver = relationship("User", foreign_keys=[approved_by_id])
