"""
Pulse Survey API Routes — Weekly check-ins, eNPS, mood trends, sentiment analysis
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, validator

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.pulse import PulseSurvey, PulseResponse, PulseStatus

router = APIRouter()


# --- Schemas ---

class SurveyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    include_enps: bool = True
    open_question: Optional[str] = None


class SurveyResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: PulseStatus
    include_enps: bool
    open_question: Optional[str]
    week_number: Optional[int]
    year: Optional[int]
    response_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class ResponseCreate(BaseModel):
    mood_score: int
    enps_score: Optional[int] = None
    open_feedback: Optional[str] = None
    is_anonymous: bool = True

    @validator("mood_score")
    def mood_must_be_valid(cls, v):
        if not 1 <= v <= 5:
            raise ValueError("Mood score must be between 1 and 5.")
        return v

    @validator("enps_score")
    def enps_must_be_valid(cls, v):
        if v is not None and not 0 <= v <= 10:
            raise ValueError("eNPS score must be between 0 and 10.")
        return v


class PulseDashboard(BaseModel):
    avg_mood: float
    enps_score: float
    promoters: int
    passives: int
    detractors: int
    total_responses: int
    mood_trend: List[dict]


def _analyze_sentiment(text: str) -> tuple[str, float]:
    """Simple keyword-based sentiment. Replace with GPT/Gemini for production."""
    if not text:
        return "neutral", 0.0
    positive_words = ["great", "amazing", "love", "excellent", "happy", "good", "fantastic", "awesome", "wonderful"]
    negative_words = ["bad", "terrible", "hate", "awful", "poor", "horrible", "worst", "disappointed", "frustrated"]
    text_lower = text.lower()
    pos = sum(1 for w in positive_words if w in text_lower)
    neg = sum(1 for w in negative_words if w in text_lower)
    if pos > neg:
        return "positive", min(1.0, pos * 0.3)
    elif neg > pos:
        return "negative", max(-1.0, -neg * 0.3)
    return "neutral", 0.0


# --- Endpoints ---

@router.post("/surveys", response_model=SurveyResponse)
async def create_survey(
    survey: SurveyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(HR/Admin) Creates a new pulse survey for the week."""
    now = datetime.utcnow()
    new_survey = PulseSurvey(
        company_id=current_user.company_id,
        created_by=current_user.id,
        week_number=now.isocalendar()[1],
        year=now.year,
        **survey.model_dump()
    )
    db.add(new_survey)
    db.commit()
    db.refresh(new_survey)
    return SurveyResponse(
        id=new_survey.id,
        title=new_survey.title,
        description=new_survey.description,
        status=new_survey.status,
        include_enps=new_survey.include_enps,
        open_question=new_survey.open_question,
        week_number=new_survey.week_number,
        year=new_survey.year,
        response_count=0,
        created_at=new_survey.created_at
    )


@router.get("/surveys", response_model=List[SurveyResponse])
async def list_surveys(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Lists all pulse surveys for the company."""
    surveys = db.query(PulseSurvey).filter(
        PulseSurvey.company_id == current_user.company_id
    ).order_by(PulseSurvey.created_at.desc()).all()

    result = []
    for s in surveys:
        result.append(SurveyResponse(
            id=s.id, title=s.title, description=s.description, status=s.status,
            include_enps=s.include_enps, open_question=s.open_question,
            week_number=s.week_number, year=s.year,
            response_count=len(s.responses), created_at=s.created_at
        ))
    return result


@router.get("/surveys/active")
async def get_active_survey(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns the current active survey for the employee to fill out."""
    survey = db.query(PulseSurvey).filter(
        PulseSurvey.company_id == current_user.company_id,
        PulseSurvey.status == PulseStatus.ACTIVE
    ).order_by(PulseSurvey.created_at.desc()).first()

    if not survey:
        return {"survey": None}

    # Check if current user already responded
    existing_response = db.query(PulseResponse).filter(
        PulseResponse.survey_id == survey.id,
        PulseResponse.employee_id == current_user.id
    ).first()

    return {
        "survey": {
            "id": survey.id,
            "title": survey.title,
            "description": survey.description,
            "include_enps": survey.include_enps,
            "open_question": survey.open_question,
        },
        "already_responded": existing_response is not None
    }


@router.post("/surveys/{survey_id}/respond")
async def submit_response(
    survey_id: int,
    response: ResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Employee submits their pulse survey response."""
    survey = db.query(PulseSurvey).filter(
        PulseSurvey.id == survey_id,
        PulseSurvey.company_id == current_user.company_id,
        PulseSurvey.status == PulseStatus.ACTIVE
    ).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found or closed.")

    # Prevent duplicate responses
    existing = db.query(PulseResponse).filter(
        PulseResponse.survey_id == survey_id,
        PulseResponse.employee_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already responded to this survey.")

    sentiment, score = _analyze_sentiment(response.open_feedback or "")

    new_response = PulseResponse(
        survey_id=survey_id,
        employee_id=current_user.id,
        company_id=current_user.company_id,
        mood_score=response.mood_score,
        enps_score=response.enps_score,
        open_feedback=response.open_feedback,
        is_anonymous=response.is_anonymous,
        sentiment=sentiment,
        sentiment_score=score
    )
    db.add(new_response)
    db.commit()
    return {"detail": "Response submitted. Thank you!"}


@router.get("/dashboard", response_model=PulseDashboard)
async def get_pulse_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(HR/Admin) Returns pulse analytics — average mood, eNPS score, trends."""
    responses = db.query(PulseResponse).filter(
        PulseResponse.company_id == current_user.company_id
    ).all()

    if not responses:
        return PulseDashboard(avg_mood=0, enps_score=0, promoters=0, passives=0, detractors=0, total_responses=0, mood_trend=[])

    total = len(responses)
    avg_mood = sum(r.mood_score for r in responses) / total

    # eNPS calculation
    enps_responses = [r for r in responses if r.enps_score is not None]
    promoters = len([r for r in enps_responses if r.enps_score >= 9])
    passives = len([r for r in enps_responses if 7 <= r.enps_score <= 8])
    detractors = len([r for r in enps_responses if r.enps_score <= 6])
    enps_total = len(enps_responses)
    enps_score = ((promoters - detractors) / enps_total * 100) if enps_total > 0 else 0

    # Weekly mood trend (last 8 weeks)
    from collections import defaultdict
    weekly = defaultdict(list)
    for r in responses:
        week_key = f"{r.submitted_at.year}-W{r.submitted_at.isocalendar()[1]:02d}"
        weekly[week_key].append(r.mood_score)

    trend = [
        {"week": k, "avg_mood": round(sum(v) / len(v), 2), "count": len(v)}
        for k, v in sorted(weekly.items())[-8:]
    ]

    return PulseDashboard(
        avg_mood=round(avg_mood, 2),
        enps_score=round(enps_score, 1),
        promoters=promoters,
        passives=passives,
        detractors=detractors,
        total_responses=total,
        mood_trend=trend
    )
