from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.company import Company, SubscriptionPlan, SubscriptionStatus
from typing import List, Dict, Any

router = APIRouter()

@router.get("/metrics")
async def get_sales_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    Returns global platform metrics for the owner.
    In a real app, we would check for is_superuser=True.
    """
    # Total Companies
    total_companies = db.query(Company).count()
    
    # Subscription Breakdown
    pro_count = db.query(Company).filter(Company.plan == SubscriptionPlan.PRO).count()
    ent_count = db.query(Company).filter(Company.plan == SubscriptionPlan.ENTERPRISE).count()
    
    # Simple MRR Calculation (Pro: $49, Ent: $199)
    # Using float for simplicity in this audit view
    mrr = (pro_count * 49) + (ent_count * 199)
    
    return {
        "total_companies": total_companies,
        "active_subscriptions": pro_count + ent_count,
        "mrr": mrr,
        "growth": 15, # Mock growth %
        "plan_breakdown": {
            "FREE": total_companies - (pro_count + ent_count),
            "PRO": pro_count,
            "ENTERPRISE": ent_count
        }
    }

@router.get("/companies")
async def list_all_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Lists all companies registered on the platform for oversight."""
    companies = db.query(Company).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "country": c.country,
            "plan": c.plan.name,
            "status": c.subscription_status.name,
            "created_at": c.created_at
        } for c in companies
    ]
