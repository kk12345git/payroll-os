from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class GoalStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class OKRGoal(Base):
    __tablename__ = "okr_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(String)
    
    target_value = Column(Float, default=100.0)
    current_value = Column(Float, default=0.0)
    unit = Column(String, default="%") # e.g., %, sales count, etc.
    
    due_date = Column(Date)
    status = Column(SQLEnum(GoalStatus), default=GoalStatus.PENDING)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("Employee")

class FeedbackReview(Base):
    __tablename__ = "feedback_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False) # The person giving feedback
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    period = Column(String) # e.g., "Q1 2026", "Annual 2025"
    
    rating = Column(Integer) # scale 1-5
    comments = Column(String)
    
    strengths = Column(String)
    improvements = Column(String)
    
    is_anonymous = Column(Boolean, default=False)
    is_finalized = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    employee = relationship("Employee")
    reviewer = relationship("User")
