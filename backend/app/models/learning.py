"""
LMS Models — Courses, Lessons, Enrollments, Skill Paths, Certifications, Leaderboard
"""
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean, Float
from sqlalchemy.orm import relationship
from app.core.database import Base


class CourseStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class CourseLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class LessonType(str, enum.Enum):
    VIDEO = "video"
    ARTICLE = "article"
    QUIZ = "quiz"
    ASSIGNMENT = "assignment"


class EnrollmentStatus(str, enum.Enum):
    ENROLLED = "enrolled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DROPPED = "dropped"


class Course(Base):
    __tablename__ = "lms_courses"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)      # e.g. "Leadership", "Compliance", "Technical"
    tags = Column(String(500), nullable=True)           # comma-separated
    level = Column(Enum(CourseLevel), default=CourseLevel.BEGINNER)
    status = Column(Enum(CourseStatus), default=CourseStatus.DRAFT)

    duration_minutes = Column(Integer, default=0)
    is_mandatory = Column(Boolean, default=False)
    certificate_on_completion = Column(Boolean, default=True)
    passing_score = Column(Integer, default=70)          # % score needed to pass

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan", order_by="Lesson.order_index")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lms_lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("lms_courses.id"), nullable=False, index=True)

    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)           # Article body OR video URL
    lesson_type = Column(Enum(LessonType), default=LessonType.ARTICLE)
    order_index = Column(Integer, default=0)
    duration_minutes = Column(Integer, default=5)

    # For quiz lessons
    quiz_questions = Column(Text, nullable=True)    # JSON: [{question, options, answer}]
    is_required = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="lessons")
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")


class Enrollment(Base):
    __tablename__ = "lms_enrollments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("lms_courses.id"), nullable=False, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.ENROLLED)
    progress_pct = Column(Float, default=0.0)       # 0-100
    score = Column(Float, nullable=True)            # Final quiz/assignment score
    passed = Column(Boolean, nullable=True)

    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    deadline = Column(DateTime, nullable=True)

    course = relationship("Course", back_populates="enrollments")
    lesson_progress = relationship("LessonProgress", back_populates="enrollment", cascade="all, delete-orphan")


class LessonProgress(Base):
    __tablename__ = "lms_lesson_progress"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("lms_enrollments.id"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lms_lessons.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    completed = Column(Boolean, default=False)
    score = Column(Float, nullable=True)            # For quiz lessons
    time_spent_minutes = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)

    enrollment = relationship("Enrollment", back_populates="lesson_progress")
    lesson = relationship("Lesson", back_populates="progress_records")


class SkillPath(Base):
    """A curated sequence of courses forming a learning path."""
    __tablename__ = "lms_skill_paths"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_role = Column(String(100), nullable=True)    # e.g. "Senior Engineer", "Team Lead"
    course_ids = Column(Text, nullable=True)            # JSON list of course IDs in order
    estimated_hours = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)


class Certificate(Base):
    __tablename__ = "lms_certificates"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("lms_courses.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    certificate_number = Column(String(50), unique=True, nullable=False)
    score = Column(Float, nullable=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    course = relationship("Course")
