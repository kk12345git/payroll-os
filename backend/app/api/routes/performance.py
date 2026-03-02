"""
360° Performance Management API — Review Cycles, OKR Cascade, Competency Ratings, Calibration
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel
import json

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.performance import (
    OKRGoal, FeedbackReview, GoalStatus, OKRLevel,
    ReviewType, ReviewCycle, ReviewCycleStatus
)

router = APIRouter()

# ------- Schemas -------

class CycleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    review_types: str = "self,peer,manager"
    include_okr_score: bool = True
    include_competencies: bool = True
    submission_deadline: Optional[date] = None
    calibration_date: Optional[date] = None


class CycleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    status: ReviewCycleStatus
    review_types: str
    submission_deadline: Optional[date]
    review_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class OKRCreate(BaseModel):
    employee_id: int
    title: str
    description: Optional[str] = None
    key_result: Optional[str] = None
    target_value: float = 100.0
    current_value: float = 0.0
    unit: str = "%"
    due_date: Optional[date] = None
    level: OKRLevel = OKRLevel.INDIVIDUAL
    parent_okr_id: Optional[int] = None
    confidence: int = 50


class OKRUpdate(BaseModel):
    current_value: Optional[float] = None
    status: Optional[GoalStatus] = None
    confidence: Optional[int] = None
    description: Optional[str] = None


class OKRResponse(BaseModel):
    id: int
    employee_id: int
    title: str
    description: Optional[str]
    key_result: Optional[str]
    target_value: float
    current_value: float
    unit: str
    status: GoalStatus
    level: OKRLevel
    confidence: int
    due_date: Optional[date]
    progress_pct: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True


class FeedbackCreate(BaseModel):
    employee_id: int
    review_type: ReviewType = ReviewType.MANAGER
    period: Optional[str] = None
    cycle_id: Optional[int] = None
    rating: Optional[int] = None
    comments: Optional[str] = None
    strengths: Optional[str] = None
    improvements: Optional[str] = None
    competency_ratings: Optional[dict] = None
    is_anonymous: bool = False


class CalibrationUpdate(BaseModel):
    calibrated_rating: int
    calibration_notes: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: int
    employee_id: int
    reviewer_id: int
    review_type: ReviewType
    period: Optional[str]
    rating: Optional[int]
    comments: Optional[str]
    strengths: Optional[str]
    improvements: Optional[str]
    competency_ratings: Optional[dict]
    calibrated_rating: Optional[int]
    is_calibrated: bool
    is_anonymous: bool
    is_finalized: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ------- Helpers -------

def _okr_to_response(okr: OKRGoal) -> OKRResponse:
    progress = round((okr.current_value / okr.target_value) * 100, 1) if okr.target_value > 0 else 0
    return OKRResponse(
        id=okr.id, employee_id=okr.employee_id, title=okr.title,
        description=okr.description, key_result=okr.key_result,
        target_value=okr.target_value, current_value=okr.current_value,
        unit=okr.unit, status=okr.status, level=okr.level,
        confidence=okr.confidence, due_date=okr.due_date,
        progress_pct=min(progress, 100), created_at=okr.created_at
    )


def _review_to_response(r: FeedbackReview) -> FeedbackResponse:
    comp = None
    if r.competency_ratings:
        try:
            comp = json.loads(r.competency_ratings)
        except Exception:
            comp = None
    return FeedbackResponse(
        id=r.id, employee_id=r.employee_id, reviewer_id=r.reviewer_id,
        review_type=r.review_type, period=r.period, rating=r.rating,
        comments=r.comments, strengths=r.strengths, improvements=r.improvements,
        competency_ratings=comp, calibrated_rating=r.calibrated_rating,
        is_calibrated=r.is_calibrated, is_anonymous=r.is_anonymous,
        is_finalized=r.is_finalized, created_at=r.created_at
    )


# ------- Review Cycle Endpoints -------

@router.post("/cycles", response_model=CycleResponse)
async def create_cycle(
    cycle: CycleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(HR/Admin) Creates a new review cycle."""
    new_cycle = ReviewCycle(
        company_id=current_user.company_id,
        created_by=current_user.id,
        **cycle.model_dump()
    )
    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)
    return CycleResponse(
        id=new_cycle.id, name=new_cycle.name, description=new_cycle.description,
        status=new_cycle.status, review_types=new_cycle.review_types,
        submission_deadline=new_cycle.submission_deadline,
        review_count=0, created_at=new_cycle.created_at
    )


@router.get("/cycles", response_model=List[CycleResponse])
async def list_cycles(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Lists all review cycles for the company."""
    cycles = db.query(ReviewCycle).filter(
        ReviewCycle.company_id == current_user.company_id
    ).order_by(ReviewCycle.created_at.desc()).all()
    return [
        CycleResponse(id=c.id, name=c.name, description=c.description,
                      status=c.status, review_types=c.review_types,
                      submission_deadline=c.submission_deadline,
                      review_count=len(c.reviews), created_at=c.created_at)
        for c in cycles
    ]


@router.patch("/cycles/{cycle_id}/status")
async def update_cycle_status(
    cycle_id: int,
    status: ReviewCycleStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin) Advances the review cycle phase."""
    cycle = db.query(ReviewCycle).filter(
        ReviewCycle.id == cycle_id,
        ReviewCycle.company_id == current_user.company_id
    ).first()
    if not cycle:
        raise HTTPException(status_code=404, detail="Review cycle not found.")
    cycle.status = status
    db.commit()
    return {"detail": f"Cycle status updated to {status}."}


# ------- OKR Endpoints -------

@router.post("/okrs", response_model=OKRResponse)
async def create_okr(
    okr: OKRCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Creates a new OKR for an employee."""
    new_okr = OKRGoal(company_id=current_user.company_id, **okr.model_dump())
    db.add(new_okr)
    db.commit()
    db.refresh(new_okr)
    return _okr_to_response(new_okr)


@router.get("/okrs/{employee_id}", response_model=List[OKRResponse])
async def get_employee_okrs(
    employee_id: int,
    level: Optional[OKRLevel] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns OKRs for a specific employee, optionally filtered by level."""
    query = db.query(OKRGoal).filter(
        OKRGoal.employee_id == employee_id,
        OKRGoal.company_id == current_user.company_id
    )
    if level:
        query = query.filter(OKRGoal.level == level)
    return [_okr_to_response(o) for o in query.all()]


@router.get("/okrs/company/cascade")
async def get_company_okrs(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns company-level OKRs for the cascade view."""
    company_okrs = db.query(OKRGoal).filter(
        OKRGoal.company_id == current_user.company_id,
        OKRGoal.level == OKRLevel.COMPANY
    ).all()
    result = []
    for okr in company_okrs:
        children = db.query(OKRGoal).filter(OKRGoal.parent_okr_id == okr.id).all()
        result.append({
            "okr": _okr_to_response(okr).model_dump(),
            "children": [_okr_to_response(c).model_dump() for c in children]
        })
    return result


@router.patch("/okrs/{okr_id}", response_model=OKRResponse)
async def update_okr(
    okr_id: int,
    update: OKRUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Updates OKR progress, status, or confidence score."""
    okr = db.query(OKRGoal).filter(
        OKRGoal.id == okr_id,
        OKRGoal.company_id == current_user.company_id
    ).first()
    if not okr:
        raise HTTPException(status_code=404, detail="OKR not found.")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(okr, field, value)
    db.commit()
    db.refresh(okr)
    return _okr_to_response(okr)


# ------- Feedback / Review Endpoints -------

@router.post("/reviews", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Submits a 360° performance feedback."""
    data = feedback.model_dump()
    comp_ratings = data.pop("competency_ratings", None)
    new_review = FeedbackReview(
        company_id=current_user.company_id,
        reviewer_id=current_user.id,
        competency_ratings=json.dumps(comp_ratings) if comp_ratings else None,
        submitted_at=datetime.utcnow(),
        **data
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return _review_to_response(new_review)


@router.get("/reviews/{employee_id}", response_model=List[FeedbackResponse])
async def get_employee_reviews(
    employee_id: int,
    review_type: Optional[ReviewType] = None,
    cycle_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns 360° reviews for an employee, optionally filtered by type or cycle."""
    query = db.query(FeedbackReview).filter(
        FeedbackReview.employee_id == employee_id,
        FeedbackReview.company_id == current_user.company_id
    )
    if review_type:
        query = query.filter(FeedbackReview.review_type == review_type)
    if cycle_id:
        query = query.filter(FeedbackReview.cycle_id == cycle_id)
    return [_review_to_response(r) for r in query.all()]


@router.patch("/reviews/{review_id}/calibrate")
async def calibrate_review(
    review_id: int,
    calibration: CalibrationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(HR/Admin) Applies a calibrated rating after review session."""
    review = db.query(FeedbackReview).filter(
        FeedbackReview.id == review_id,
        FeedbackReview.company_id == current_user.company_id
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found.")
    review.calibrated_rating = calibration.calibrated_rating
    review.calibration_notes = calibration.calibration_notes
    review.is_calibrated = True
    db.commit()
    return {"detail": "Calibration applied.", "calibrated_rating": calibration.calibrated_rating}


@router.get("/heatmap")
async def get_performance_heatmap(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns performance heatmap data — avg rating per employee."""
    from sqlalchemy import func
    from app.models.employee import Employee as EmployeeModel
    results = db.query(
        FeedbackReview.employee_id,
        func.avg(FeedbackReview.rating).label("avg_rating"),
        func.count(FeedbackReview.id).label("review_count")
    ).filter(
        FeedbackReview.company_id == current_user.company_id,
        FeedbackReview.rating.isnot(None)
    ).group_by(FeedbackReview.employee_id).all()

    return [
        {
            "employee_id": r.employee_id,
            "avg_rating": round(r.avg_rating, 2),
            "review_count": r.review_count,
        }
        for r in results
    ]
