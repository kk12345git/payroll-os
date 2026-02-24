import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class GigStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Gig(Base):
    __tablename__ = "talent_gigs"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(Numeric(precision=15, scale=2), default=0)
    required_skills = Column(String) # Comma separated
    status = Column(SQLEnum(GigStatus), default=GigStatus.OPEN)
    deadline = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    applications = relationship("GigApplication", back_populates="gig")

class GigApplication(Base):
    __tablename__ = "talent_gig_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    gig_id = Column(Integer, ForeignKey("talent_gigs.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    cover_letter = Column(Text)
    status = Column(String, default="pending") # pending, accepted, rejected
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    gig = relationship("Gig", back_populates="applications")
