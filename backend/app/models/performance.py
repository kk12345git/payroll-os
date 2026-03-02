from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, Float, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class GoalStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    AT_RISK = "at_risk"


class OKRLevel(str, enum.Enum):
    COMPANY = "company"
    TEAM = "team"
    INDIVIDUAL = "individual"


class ReviewType(str, enum.Enum):
    SELF = "self"
    PEER = "peer"
    MANAGER = "manager"
    UPWARD = "upward"


class ReviewCycleStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    REVIEW_PHASE = "review_phase"
    CALIBRATION = "calibration"
    COMPLETED = "completed"


class ReviewCycle(Base):
    """A performance review cycle (e.g. Q1 2026 Review, Annual 2025)"""
    __tablename__ = "review_cycles"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(ReviewCycleStatus), default=ReviewCycleStatus.DRAFT)

    review_types = Column(String(200), default="self,peer,manager")
    include_okr_score = Column(Boolean, default=True)
    include_competencies = Column(Boolean, default=True)

    submission_deadline = Column(Date, nullable=True)
    calibration_date = Column(Date, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    reviews = relationship("FeedbackReview", back_populates="cycle", cascade="all, delete-orphan")


class OKRGoal(Base):
    __tablename__ = "okr_goals"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    parent_okr_id = Column(Integer, ForeignKey("okr_goals.id"), nullable=True)

    level = Column(SQLEnum(OKRLevel), default=OKRLevel.INDIVIDUAL)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    key_result = Column(String(500), nullable=True)

    target_value = Column(Float, default=100.0)
    current_value = Column(Float, default=0.0)
    unit = Column(String(50), default="%")

    due_date = Column(Date, nullable=True)
    status = Column(SQLEnum(GoalStatus), default=GoalStatus.PENDING)
    confidence = Column(Integer, default=50)

    is_company_goal = Column(Boolean, default=False)
    is_team_goal = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    employee = relationship("Employee")
    child_okrs = relationship("OKRGoal", foreign_keys=[parent_okr_id])


class FeedbackReview(Base):
    __tablename__ = "feedback_reviews"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    cycle_id = Column(Integer, ForeignKey("review_cycles.id"), nullable=True)

    review_type = Column(SQLEnum(ReviewType), default=ReviewType.MANAGER)
    period = Column(String(100), nullable=True)

    rating = Column(Integer, nullable=True)
    comments = Column(Text, nullable=True)
    strengths = Column(Text, nullable=True)
    improvements = Column(Text, nullable=True)

    # Competency ratings as JSON string: {"communication": 4, "leadership": 3, "execution": 5}
    competency_ratings = Column(Text, nullable=True)

    calibrated_rating = Column(Integer, nullable=True)
    calibration_notes = Column(Text, nullable=True)
    is_calibrated = Column(Boolean, default=False)

    is_anonymous = Column(Boolean, default=False)
    is_finalized = Column(Boolean, default=False)
    submitted_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    employee = relationship("Employee")
    reviewer = relationship("User")
    cycle = relationship("ReviewCycle", back_populates="reviews")
