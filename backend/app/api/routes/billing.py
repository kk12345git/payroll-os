from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.company import Company, SubscriptionPlan, SubscriptionStatus
from app.services.stripe_service import StripeService
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/checkout-session")
async def create_checkout_session(
    plan: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Creates a Stripe checkout session for the user's company."""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="No company associated")
        
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    
    session_data = StripeService.create_checkout_session(
        company_id=company.id,
        company_email=current_user.email,
        plan=plan,
        country=company.country or "India"
    )
    
    return session_data

@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe Webhooks to update subscription status."""
    payload = await request.body()
    # In practice, verify signature here
    # sig_header = request.headers.get('stripe-signature')
    
    # Simulating webhook processing
    import json
    data = json.loads(payload)
    
    if data.get("type") == "checkout.session.completed":
        metadata = data["data"]["object"].get("metadata", {})
        company_id = metadata.get("company_id")
        plan_str = metadata.get("plan", "PRO").upper()
        
        if company_id:
            company = db.query(Company).filter(Company.id == int(company_id)).first()
            if company:
                company.plan = SubscriptionPlan[plan_str]
                company.subscription_status = SubscriptionStatus.ACTIVE
                company.subscription_expiry = datetime.now() + timedelta(days=365)
                db.commit()
                return {"status": "success"}
                
    return {"status": "ignored"}

@router.get("/status")
async def get_billing_status(
    current_user: User = Depends(dependencies.get_current_user),
    db: Session = Depends(get_db)
):
    """Returns current subscription info for the dashboard."""
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    return {
        "plan": company.plan,
        "status": company.subscription_status,
        "expiry": company.subscription_expiry
    }
