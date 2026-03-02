"""
LMS API Routes — Course Library, Lesson Progress, Enrollments, Certificates, Leaderboard
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
import json
import uuid

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.learning import (
    Course, Lesson, Enrollment, LessonProgress, SkillPath,
    Certificate, CourseStatus, CourseLevel, LessonType, EnrollmentStatus
)

router = APIRouter()


# ---- Schemas ----

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    level: CourseLevel = CourseLevel.BEGINNER
    duration_minutes: int = 0
    is_mandatory: bool = False
    certificate_on_completion: bool = True
    passing_score: int = 70


class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    tags: Optional[str]
    level: CourseLevel
    status: CourseStatus
    duration_minutes: int
    is_mandatory: bool
    certificate_on_completion: bool
    lesson_count: int = 0
    enrolled_count: int = 0
    completion_rate: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True


class LessonCreate(BaseModel):
    title: str
    content: Optional[str] = None
    lesson_type: LessonType = LessonType.ARTICLE
    order_index: int = 0
    duration_minutes: int = 5
    quiz_questions: Optional[list] = None
    is_required: bool = True


class LessonResponse(BaseModel):
    id: int
    title: str
    lesson_type: LessonType
    order_index: int
    duration_minutes: int
    is_required: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LessonProgressUpdate(BaseModel):
    completed: bool = True
    score: Optional[float] = None
    time_spent_minutes: int = 0


class EnrollmentResponse(BaseModel):
    id: int
    course_id: int
    employee_id: int
    status: EnrollmentStatus
    progress_pct: float
    score: Optional[float]
    passed: Optional[bool]
    enrolled_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class SkillPathCreate(BaseModel):
    title: str
    description: Optional[str] = None
    target_role: Optional[str] = None
    course_ids: List[int]
    estimated_hours: int = 0


class CertificateResponse(BaseModel):
    id: int
    employee_id: int
    course_id: int
    certificate_number: str
    score: Optional[float]
    issued_at: datetime

    class Config:
        from_attributes = True


# ---- Helpers ----

def _course_to_response(course: Course) -> CourseResponse:
    enrolled = len(course.enrollments)
    completed = len([e for e in course.enrollments if e.status == EnrollmentStatus.COMPLETED])
    rate = (completed / enrolled * 100) if enrolled > 0 else 0.0
    return CourseResponse(
        id=course.id, title=course.title, description=course.description,
        category=course.category, tags=course.tags, level=course.level,
        status=course.status, duration_minutes=course.duration_minutes,
        is_mandatory=course.is_mandatory, certificate_on_completion=course.certificate_on_completion,
        lesson_count=len(course.lessons), enrolled_count=enrolled,
        completion_rate=round(rate, 1), created_at=course.created_at
    )


def _generate_cert_number() -> str:
    return f"CERT-{uuid.uuid4().hex[:8].upper()}"


# ---- Course Endpoints ----

@router.post("/courses", response_model=CourseResponse)
async def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Creates a new training course."""
    new_course = Course(
        company_id=current_user.company_id,
        created_by=current_user.id,
        **course.model_dump()
    )
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return _course_to_response(new_course)


@router.get("/courses", response_model=List[CourseResponse])
async def list_courses(
    category: Optional[str] = None,
    level: Optional[CourseLevel] = None,
    mandatory_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Lists all published courses in the company's course library."""
    query = db.query(Course).filter(
        Course.company_id == current_user.company_id,
        Course.status == CourseStatus.PUBLISHED
    )
    if category:
        query = query.filter(Course.category == category)
    if level:
        query = query.filter(Course.level == level)
    if mandatory_only:
        query = query.filter(Course.is_mandatory == True)
    return [_course_to_response(c) for c in query.all()]


@router.patch("/courses/{course_id}/publish")
async def publish_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Publishes a draft course to make it available."""
    course = db.query(Course).filter(Course.id == course_id, Course.company_id == current_user.company_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    course.status = CourseStatus.PUBLISHED
    db.commit()
    return {"detail": "Course published successfully."}


# ---- Lesson Endpoints ----

@router.post("/courses/{course_id}/lessons", response_model=LessonResponse)
async def add_lesson(
    course_id: int,
    lesson: LessonCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Adds a lesson (video, article, quiz, assignment) to a course."""
    course = db.query(Course).filter(Course.id == course_id, Course.company_id == current_user.company_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    data = lesson.model_dump()
    quiz_q = data.pop("quiz_questions", None)
    new_lesson = Lesson(
        course_id=course_id,
        quiz_questions=json.dumps(quiz_q) if quiz_q else None,
        **data
    )
    db.add(new_lesson)
    # Update course duration
    course.duration_minutes += lesson.duration_minutes
    db.commit()
    db.refresh(new_lesson)
    return new_lesson


@router.get("/courses/{course_id}/lessons", response_model=List[LessonResponse])
async def get_lessons(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns all lessons for a course in order."""
    return db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_index).all()


@router.get("/courses/{course_id}/lessons/{lesson_id}/content")
async def get_lesson_content(
    course_id: int,
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns the full content/quiz of a lesson (requires enrollment)."""
    enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.employee_id == current_user.id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=403, detail="Please enroll in this course first.")

    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.course_id == course_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")

    quiz = None
    if lesson.quiz_questions:
        try:
            quiz = json.loads(lesson.quiz_questions)
        except Exception:
            quiz = []

    # Check if already completed
    progress = db.query(LessonProgress).filter(
        LessonProgress.enrollment_id == enrollment.id,
        LessonProgress.lesson_id == lesson_id
    ).first()

    return {
        "id": lesson.id,
        "title": lesson.title,
        "lesson_type": lesson.lesson_type,
        "content": lesson.content,
        "duration_minutes": lesson.duration_minutes,
        "quiz_questions": quiz,
        "completed": progress.completed if progress else False,
        "score": progress.score if progress else None,
    }


# ---- Enrollment Endpoints ----

@router.post("/courses/{course_id}/enroll", response_model=EnrollmentResponse)
async def enroll_in_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Employee enrolls in a course."""
    course = db.query(Course).filter(
        Course.id == course_id,
        Course.company_id == current_user.company_id,
        Course.status == CourseStatus.PUBLISHED
    ).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found or not published.")

    existing = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.employee_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course.")

    enrollment = Enrollment(
        course_id=course_id,
        employee_id=current_user.id,
        company_id=current_user.company_id,
        status=EnrollmentStatus.ENROLLED
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.get("/my-courses", response_model=List[EnrollmentResponse])
async def my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns all courses the current employee is enrolled in."""
    return db.query(Enrollment).filter(
        Enrollment.employee_id == current_user.id,
        Enrollment.company_id == current_user.company_id
    ).all()


@router.post("/courses/{course_id}/lessons/{lesson_id}/complete")
async def mark_lesson_complete(
    course_id: int,
    lesson_id: int,
    progress: LessonProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Marks a lesson as complete and recalculates overall course progress."""
    enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.employee_id == current_user.id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=403, detail="Not enrolled in this course.")

    # Upsert progress
    existing_progress = db.query(LessonProgress).filter(
        LessonProgress.enrollment_id == enrollment.id,
        LessonProgress.lesson_id == lesson_id
    ).first()

    if existing_progress:
        existing_progress.completed = progress.completed
        existing_progress.score = progress.score
        existing_progress.time_spent_minutes += progress.time_spent_minutes
        if progress.completed:
            existing_progress.completed_at = datetime.utcnow()
    else:
        new_progress = LessonProgress(
            enrollment_id=enrollment.id,
            lesson_id=lesson_id,
            employee_id=current_user.id,
            completed=progress.completed,
            score=progress.score,
            time_spent_minutes=progress.time_spent_minutes,
            completed_at=datetime.utcnow() if progress.completed else None
        )
        db.add(new_progress)

    # Recalculate overall course progress
    course = db.query(Course).filter(Course.id == course_id).first()
    total_lessons = len(course.lessons)
    completed_lessons = db.query(LessonProgress).filter(
        LessonProgress.enrollment_id == enrollment.id,
        LessonProgress.completed == True
    ).count()

    enrollment.progress_pct = round((completed_lessons / total_lessons) * 100, 1) if total_lessons > 0 else 0
    enrollment.status = EnrollmentStatus.IN_PROGRESS

    # Auto-complete if all lessons done
    if enrollment.progress_pct >= 100:
        enrollment.status = EnrollmentStatus.COMPLETED
        enrollment.completed_at = datetime.utcnow()

        # Issue certificate if course awards one
        if course.certificate_on_completion:
            existing_cert = db.query(Certificate).filter(
                Certificate.employee_id == current_user.id,
                Certificate.course_id == course_id
            ).first()
            if not existing_cert:
                cert = Certificate(
                    employee_id=current_user.id,
                    course_id=course_id,
                    company_id=current_user.company_id,
                    certificate_number=_generate_cert_number(),
                    score=progress.score
                )
                db.add(cert)

    db.commit()
    return {
        "progress_pct": enrollment.progress_pct,
        "status": enrollment.status,
        "course_completed": enrollment.status == EnrollmentStatus.COMPLETED
    }


# ---- Certificates Endpoint ----

@router.get("/certificates/mine", response_model=List[CertificateResponse])
async def my_certificates(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns all certificates earned by the current employee."""
    return db.query(Certificate).filter(
        Certificate.employee_id == current_user.id,
        Certificate.company_id == current_user.company_id
    ).all()


# ---- Leaderboard Endpoint ----

@router.get("/leaderboard")
async def get_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns the top learners leaderboard by completed courses."""
    results = db.query(
        Enrollment.employee_id,
        func.count(Enrollment.id).label("completed_courses"),
        func.sum(
            db.query(LessonProgress.time_spent_minutes)
            .filter(LessonProgress.employee_id == Enrollment.employee_id)
            .correlate(Enrollment)
            .as_scalar()
        ).label("total_minutes")
    ).filter(
        Enrollment.company_id == current_user.company_id,
        Enrollment.status == EnrollmentStatus.COMPLETED
    ).group_by(Enrollment.employee_id) \
     .order_by(func.count(Enrollment.id).desc()) \
     .limit(10).all()

    return [
        {
            "rank": idx + 1,
            "employee_id": r.employee_id,
            "completed_courses": r.completed_courses,
        }
        for idx, r in enumerate(results)
    ]


# ---- Skill Paths ----

@router.post("/skill-paths")
async def create_skill_path(
    path: SkillPathCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Creates a curated learning path for a target role."""
    new_path = SkillPath(
        company_id=current_user.company_id,
        created_by=current_user.id,
        title=path.title,
        description=path.description,
        target_role=path.target_role,
        course_ids=json.dumps(path.course_ids),
        estimated_hours=path.estimated_hours
    )
    db.add(new_path)
    db.commit()
    db.refresh(new_path)
    return {"id": new_path.id, "title": new_path.title, "target_role": new_path.target_role}


@router.get("/skill-paths")
async def list_skill_paths(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns all active skill paths in the company."""
    paths = db.query(SkillPath).filter(
        SkillPath.company_id == current_user.company_id,
        SkillPath.is_active == True
    ).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "target_role": p.target_role,
            "course_ids": json.loads(p.course_ids) if p.course_ids else [],
            "estimated_hours": p.estimated_hours,
        }
        for p in paths
    ]


# ---- Admin Stats ----

@router.get("/stats")
async def lms_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns high-level LMS analytics for the company."""
    total_courses = db.query(Course).filter(Course.company_id == current_user.company_id, Course.status == CourseStatus.PUBLISHED).count()
    total_enrollments = db.query(Enrollment).filter(Enrollment.company_id == current_user.company_id).count()
    completed = db.query(Enrollment).filter(Enrollment.company_id == current_user.company_id, Enrollment.status == EnrollmentStatus.COMPLETED).count()
    certs_issued = db.query(Certificate).filter(Certificate.company_id == current_user.company_id).count()
    completion_rate = round((completed / total_enrollments * 100), 1) if total_enrollments > 0 else 0.0

    return {
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_completions": completed,
        "certificates_issued": certs_issued,
        "completion_rate": completion_rate
    }
