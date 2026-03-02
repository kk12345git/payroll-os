"""
Pulse Survey Models — Weekly check-ins, eNPS, mood tracking, AI sentiment analysis
"""
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean, Float
from sqlalchemy.orm import relationship
from app.core.database import Base


class PulseStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"


class MoodScore(int, enum.Enum):
    TERRIBLE = 1
    BAD = 2
    NEUTRAL = 3
    GOOD = 4
    GREAT = 5


class PulseSurvey(Base):
    __tablename__ = "pulse_surveys"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(PulseStatus), default=PulseStatus.ACTIVE)

    # eNPS: "How likely are you to recommend this company as a place to work?" (0-10)
    include_enps = Column(Boolean, default=True)

    # Optional open-ended question
    open_question = Column(Text, nullable=True)

    week_number = Column(Integer, nullable=True)  # ISO week number
    year = Column(Integer, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    closes_at = Column(DateTime, nullable=True)

    responses = relationship("PulseResponse", back_populates="survey", cascade="all, delete-orphan")


class PulseResponse(Base):
    __tablename__ = "pulse_responses"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("pulse_surveys.id"), nullable=False, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    # Mood score 1-5
    mood_score = Column(Integer, nullable=False)

    # eNPS score 0-10 (0=Detractor, 7-8=Passive, 9-10=Promoter)
    enps_score = Column(Integer, nullable=True)

    # Open-ended feedback
    open_feedback = Column(Text, nullable=True)

    # AI-analyzed sentiment: positive, neutral, negative
    sentiment = Column(String(20), nullable=True)
    sentiment_score = Column(Float, nullable=True)  # -1.0 to 1.0

    is_anonymous = Column(Boolean, default=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    survey = relationship("PulseSurvey", back_populates="responses")
