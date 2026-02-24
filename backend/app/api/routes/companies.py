from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta

from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.company import Company, SubscriptionPlan, SubscriptionStatus

router = APIRouter()

class SubscriptionResponse(BaseModel):
    plan: SubscriptionPlan
    status: SubscriptionStatus
    expiry: Optional[datetime] = None

    class Config:
        from_attributes = True

class UpgradeRequest(BaseModel):
    plan: SubscriptionPlan

@router.get("/subscription", response_model=SubscriptionResponse)
async def get_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the subscription status of the current user's company"""
    if not current_user.company_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not associated with any company"
        )
    
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    return company

@router.post("/subscription/upgrade", response_model=SubscriptionResponse)
async def upgrade_subscription(
    upgrade_data: UpgradeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upgrade the current user's company subscription"""
    if not current_user.company_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not associated with any company"
        )
    
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Simple logic for now: Set plan and extend expiry by 30 days
    company.plan = upgrade_data.plan
    company.subscription_status = SubscriptionStatus.ACTIVE
    company.subscription_expiry = datetime.now() + timedelta(days=30)
    
    db.commit()
    db.refresh(company)
    
    return company

class CompanySettingsUpdate(BaseModel):
    country: Optional[str] = None
    base_currency: Optional[str] = None
    data_region: Optional[str] = None

@router.patch("/settings")
async def update_company_settings(
    settings_data: CompanySettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update company-wide settings like country, currency, and data region"""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="No company associated")
        
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    
    if settings_data.country:
        company.country = settings_data.country
    if settings_data.base_currency:
        company.base_currency = settings_data.base_currency.upper()
    if settings_data.data_region:
        company.data_region = settings_data.data_region
        
    db.commit()
    return {
        "status": "success", 
        "base_currency": company.base_currency,
        "data_region": company.data_region
    }

class SubsidiaryCreate(BaseModel):
    name: str
    registration_number: Optional[str] = None

class SubsidiaryResponse(BaseModel):
    id: int
    name: str
    registration_number: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

@router.get("/subsidiaries", response_model=List[SubsidiaryResponse])
async def list_subsidiaries(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all subsidiary companies for the current parent company"""
    return db.query(Company).filter(Company.parent_id == current_user.company_id).all()

@router.post("/subsidiaries", response_model=SubsidiaryResponse)
async def create_subsidiary(
    subsidiary_data: SubsidiaryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new subsidiary linked to the current company"""
    new_sub = Company(
        name=subsidiary_data.name,
        registration_number=subsidiary_data.registration_number,
        parent_id=current_user.company_id
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub
