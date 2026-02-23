from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.lifecycle import LifecycleTask, OffboardingProcess, TaskStatus, LifecycleType
from app.schemas.lifecycle import (
    LifecycleTaskCreate,
    LifecycleTaskUpdate,
    LifecycleTaskResponse,
    OffboardingCreate,
    OffboardingResponse
)

router = APIRouter()

@router.post("/tasks", response_model=LifecycleTaskResponse)
async def create_lifecycle_task(
    task: LifecycleTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Creates a new onboarding or offboarding task."""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
        
    new_task = LifecycleTask(
        company_id=current_user.company_id,
        **task.model_dump()
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/tasks/{employee_id}", response_model=List[LifecycleTaskResponse])
async def get_employee_tasks(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Returns all lifecycle tasks for a specific employee."""
    return db.query(LifecycleTask).filter(
        LifecycleTask.employee_id == employee_id,
        LifecycleTask.company_id == current_user.company_id
    ).all()

@router.patch("/tasks/{task_id}", response_model=LifecycleTaskResponse)
async def update_task_status(
    task_id: int,
    update: LifecycleTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR/Assignee) Updates the status of a lifecycle task."""
    task = db.query(LifecycleTask).filter(
        LifecycleTask.id == task_id,
        LifecycleTask.company_id == current_user.company_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
        
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
        
    if update.status == TaskStatus.COMPLETED:
        task.completed_at = func.now()
        
    db.commit()
    db.refresh(task)
    return task

@router.post("/offboard", response_model=OffboardingResponse)
async def initiate_offboarding(
    process: OffboardingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Initiates the formal offboarding process for an employee."""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
        
    existing = db.query(OffboardingProcess).filter(OffboardingProcess.employee_id == process.employee_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Offboarding already initiated for this employee.")
        
    new_process = OffboardingProcess(
        company_id=current_user.company_id,
        **process.model_dump()
    )
    
    # Auto-generate common offboarding tasks
    default_tasks = [
        ("IT Clearance", "Revoke access to all internal systems and email."),
        ("Asset Collection", "Collect laptop, charger, and ID badge."),
        ("Exit Interview", "Conduct and record formal exit interview."),
        ("Final Settlement", "Calculate and process Full & Final payment.")
    ]
    
    for title, desc in default_tasks:
        db.add(LifecycleTask(
            employee_id=process.employee_id,
            company_id=current_user.company_id,
            category=LifecycleType.OFFBOARDING,
            title=title,
            description=desc,
            due_date=process.last_working_day
        ))
    
    db.add(new_process)
    db.commit()
    db.refresh(new_process)
    return new_process
