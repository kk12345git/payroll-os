"""
People Hub API Routes — Posts, Shoutouts, Kudos, Reactions, Comments
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.engagement import EngagementPost, PostReaction, PostComment, PostType, ReactionType

router = APIRouter()


# --- Schemas ---

class PostCreate(BaseModel):
    post_type: PostType = PostType.GENERAL
    title: Optional[str] = None
    content: str
    recipient_id: Optional[int] = None
    recipient_name: Optional[str] = None
    kudos_badge: Optional[str] = None


class PostResponse(BaseModel):
    id: int
    post_type: PostType
    title: Optional[str]
    content: str
    author_id: int
    recipient_id: Optional[int]
    recipient_name: Optional[str]
    kudos_badge: Optional[str]
    is_pinned: bool
    reaction_count: int = 0
    comment_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: int
    author_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReactionCreate(BaseModel):
    reaction_type: ReactionType = ReactionType.LIKE


# --- Endpoints ---

@router.get("/feed", response_model=List[PostResponse])
async def get_people_feed(
    post_type: Optional[PostType] = Query(None),
    limit: int = Query(20, le=50),
    offset: int = Query(0),
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Gets the company's People Hub feed (posts, shoutouts, announcements)."""
    query = db.query(EngagementPost).filter(
        EngagementPost.company_id == current_user.company_id,
        EngagementPost.is_active == True
    )
    if post_type:
        query = query.filter(EngagementPost.post_type == post_type)

    posts = query.order_by(EngagementPost.is_pinned.desc(), EngagementPost.created_at.desc()) \
                 .offset(offset).limit(limit).all()

    result = []
    for post in posts:
        d = PostResponse(
            id=post.id,
            post_type=post.post_type,
            title=post.title,
            content=post.content,
            author_id=post.author_id,
            recipient_id=post.recipient_id,
            recipient_name=post.recipient_name,
            kudos_badge=post.kudos_badge,
            is_pinned=post.is_pinned,
            reaction_count=len(post.reactions),
            comment_count=len([c for c in post.comments if c.is_active]),
            created_at=post.created_at,
        )
        result.append(d)
    return result


@router.post("/posts", response_model=PostResponse)
async def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Creates a new post (announcement, shoutout, kudos, update)."""
    new_post = EngagementPost(
        company_id=current_user.company_id,
        author_id=current_user.id,
        **post.model_dump()
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return PostResponse(
        id=new_post.id,
        post_type=new_post.post_type,
        title=new_post.title,
        content=new_post.content,
        author_id=new_post.author_id,
        recipient_id=new_post.recipient_id,
        recipient_name=new_post.recipient_name,
        kudos_badge=new_post.kudos_badge,
        is_pinned=new_post.is_pinned,
        reaction_count=0,
        comment_count=0,
        created_at=new_post.created_at,
    )


@router.post("/posts/{post_id}/react")
async def react_to_post(
    post_id: int,
    reaction: ReactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Toggle a reaction on a post. If same reaction exists, removes it."""
    post = db.query(EngagementPost).filter(
        EngagementPost.id == post_id,
        EngagementPost.company_id == current_user.company_id
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    existing = db.query(PostReaction).filter(
        PostReaction.post_id == post_id,
        PostReaction.user_id == current_user.id,
        PostReaction.reaction_type == reaction.reaction_type
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"action": "removed", "reaction_type": reaction.reaction_type}
    else:
        new_reaction = PostReaction(
            post_id=post_id,
            user_id=current_user.id,
            company_id=current_user.company_id,
            reaction_type=reaction.reaction_type
        )
        db.add(new_reaction)
        db.commit()
        return {"action": "added", "reaction_type": reaction.reaction_type}


@router.post("/posts/{post_id}/comments", response_model=CommentResponse)
async def add_comment(
    post_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Adds a comment to a post."""
    post = db.query(EngagementPost).filter(
        EngagementPost.id == post_id,
        EngagementPost.company_id == current_user.company_id
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    new_comment = PostComment(
        post_id=post_id,
        author_id=current_user.id,
        company_id=current_user.company_id,
        content=comment.content
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Gets all comments for a post."""
    return db.query(PostComment).filter(
        PostComment.post_id == post_id,
        PostComment.company_id == current_user.company_id,
        PostComment.is_active == True
    ).order_by(PostComment.created_at.asc()).all()


@router.delete("/posts/{post_id}")
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Soft-deletes a post (author or admin only)."""
    post = db.query(EngagementPost).filter(
        EngagementPost.id == post_id,
        EngagementPost.company_id == current_user.company_id
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own posts.")
    post.is_active = False
    db.commit()
    return {"detail": "Post deleted."}
