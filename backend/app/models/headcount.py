"""
Headcount Planning & Workforce Strategy Models
"""
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float, Date, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base


class RequisitionStatus(str, enum.Enum):
    DRAFT = "draft"
    APPROVED = "approved"
    IN_PROGRESS = "in_progress"
    FILLED = "filled"
    CANCELLED = "cancelled"


class RequisitionPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ScenarioType(str, enum.Enum):
    GROWTH = "growth"           # Hiring ramp-up
    RESTRUCTURE = "restructure" # Team reorg
    COST_CUT = "cost_cut"       # Headcount reduction
    STEADY = "steady"           # Maintain


class HeadcountPlan(Base):
    """Annual/Quarterly headcount plan per department."""
    __tablename__ = "headcount_plans"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    title = Column(String(255), nullable=False)         # e.g. "FY 2026 Engineering Plan"
    period = Column(String(50), nullable=False)         # e.g. "Q1 2026", "FY 2026"
    current_headcount = Column(Integer, default=0)
    target_headcount = Column(Integer, default=0)
    approved_budget = Column(Float, default=0.0)        # Total salary budget in ₹
    notes = Column(Text, nullable=True)
    is_approved = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    requisitions = relationship("RoleRequisition", back_populates="plan", cascade="all, delete-orphan")


class RoleRequisition(Base):
    """A specific open role/position to be hired for."""
    __tablename__ = "role_requisitions"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("headcount_plans.id"), nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    job_title = Column(String(255), nullable=False)
    job_level = Column(String(100), nullable=True)      # Junior / Mid / Senior / Lead
    job_type = Column(String(50), default="full_time")  # full_time / contract / intern
    location = Column(String(100), nullable=True)
    is_remote = Column(Boolean, default=False)

    min_salary = Column(Float, nullable=True)
    max_salary = Column(Float, nullable=True)
    target_start_date = Column(Date, nullable=True)

    status = Column(Enum(RequisitionStatus), default=RequisitionStatus.DRAFT)
    priority = Column(Enum(RequisitionPriority), default=RequisitionPriority.MEDIUM)

    justification = Column(Text, nullable=True)         # Why is this role needed?
    skills_required = Column(Text, nullable=True)       # Comma-separated

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    plan = relationship("HeadcountPlan", back_populates="requisitions")


class WorkforceScenario(Base):
    """What-if workforce planning scenario."""
    __tablename__ = "workforce_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String(255), nullable=False)          # e.g. "Aggressive Growth Q2"
    description = Column(Text, nullable=True)
    scenario_type = Column(Enum(ScenarioType), default=ScenarioType.GROWTH)

    # Parameters
    growth_rate_pct = Column(Float, default=0.0)        # +20% = hire 20% more
    attrition_rate_pct = Column(Float, default=10.0)    # expected attrition
    salary_increase_pct = Column(Float, default=0.0)    # projected salary hike
    timeframe_months = Column(Integer, default=12)

    # Results (stored after simulation)
    projected_headcount = Column(Integer, nullable=True)
    projected_cost = Column(Float, nullable=True)
    net_hires_needed = Column(Integer, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
