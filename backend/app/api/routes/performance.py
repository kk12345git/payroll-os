from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.performance import OKRGoal, FeedbackReview, GoalStatus
from app.schemas.performance import OKRCreate, OKRUpdate, OKRResponse, FeedbackCreate, FeedbackResponse

router = APIRouter()

# --- OKR Management ---

@router.post("/okrs", response_model=OKRResponse)
async def create_okr(
    okr: OKRCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Sets a new OKR goal for an employee."""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
        
    new_okr = OKRGoal(
        company_id=current_user.company_id,
        **okr.model_dump()
    )
    db.add(new_okr)
    db.commit()
    db.refresh(new_okr)
    return new_okr

@router.get("/okrs/{employee_id}", response_model=List[OKRResponse])
async def get_employee_okrs(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns all OKRs for a specific employee."""
    return db.query(OKRGoal).filter(
        OKRGoal.employee_id == employee_id,
        OKRGoal.company_id == current_user.company_id
    ).all()

@router.patch("/okrs/{okr_id}", response_model=OKRResponse)
async def update_okr_progress(
    okr_id: int,
    update: OKRUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Updates the progress or status of an OKR."""
    okr = db.query(OKRGoal).filter(OKRGoal.id == okr_id, OKRGoal.company_id == current_user.company_id).first()
    if not okr:
        raise HTTPException(status_code=404, detail="OKR not found.")
        
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(okr, field, value)
        
    db.commit()
    db.refresh(okr)
    return okr

# --- Feedback & Reviews ---

@router.post("/reviews", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Submits a performance feedback/review for an employee."""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
        
    new_review = FeedbackReview(
        company_id=current_user.company_id,
        reviewer_id=current_user.id,
        **feedback.model_dump()
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@router.get("/reviews/{employee_id}", response_model=List[FeedbackResponse])
async def get_employee_reviews(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns all performance reviews for a specific employee."""
    return db.query(FeedbackReview).filter(
        FeedbackReview.employee_id == employee_id,
        FeedbackReview.company_id == current_user.company_id
    ).all()
