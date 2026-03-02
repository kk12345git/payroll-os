"""
People Hub Models — Posts, Kudos/Shoutouts, Comments, Reactions
"""
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base


class PostType(str, enum.Enum):
    ANNOUNCEMENT = "announcement"
    SHOUTOUT = "shoutout"
    UPDATE = "update"
    CELEBRATION = "celebration"
    GENERAL = "general"


class ReactionType(str, enum.Enum):
    LIKE = "like"
    LOVE = "love"
    CELEBRATE = "celebrate"
    SUPPORT = "support"
    INSIGHTFUL = "insightful"


class EngagementPost(Base):
    __tablename__ = "engagement_posts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    post_type = Column(Enum(PostType), default=PostType.GENERAL, nullable=False)
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)

    # For shoutouts — who is being recognized
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    recipient_name = Column(String(255), nullable=True)

    # For kudos — the badge type
    kudos_badge = Column(String(100), nullable=True)  # e.g. "Team Player", "Innovator", "Above and Beyond"

    is_pinned = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reactions = relationship("PostReaction", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("PostComment", back_populates="post", cascade="all, delete-orphan")


class PostReaction(Base):
    __tablename__ = "post_reactions"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("engagement_posts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    reaction_type = Column(Enum(ReactionType), default=ReactionType.LIKE, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("EngagementPost", back_populates="reactions")


class PostComment(Base):
    __tablename__ = "post_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("engagement_posts.id"), nullable=False, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    post = relationship("EngagementPost", back_populates="comments")
