from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class LifecycleType(str, enum.Enum):
    ONBOARDING = "onboarding"
    OFFBOARDING = "offboarding"

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class LifecycleTask(Base):
    __tablename__ = "lifecycle_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    category = Column(SQLEnum(LifecycleType), nullable=False)
    title = Column(String, nullable=False) # e.g., "ID Card Issue", "IT Asset Collection"
    description = Column(String)
    
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Admin/IT person
    due_date = Column(Date)
    
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.PENDING)
    completed_at = Column(DateTime(timezone=True))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("Employee")
    assignee = relationship("User")

class OffboardingProcess(Base):
    __tablename__ = "offboarding_processes"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, unique=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    resignation_date = Column(Date, nullable=False)
    last_working_day = Column(Date, nullable=False)
    notice_period_days = Column(Integer, default=30)
    
    reason = Column(String)
    final_settlement_status = Column(String, default="Pending") # Pending, Calculated, Paid
    
    is_cleared = Column(Boolean, default=False) # Global clearance from all depts
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    employee = relationship("Employee")
