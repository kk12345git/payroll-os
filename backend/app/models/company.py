import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class SubscriptionPlan(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    TRIAL = "trial"
    EXPIRED = "expired"


class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    registration_number = Column(String, unique=True)
    pan = Column(String, unique=True)
    tan = Column(String)
    pf_number = Column(String)
    esi_number = Column(String)
    pt_registration = Column(String)
    address = Column(String)
    city = Column(String)
    state = Column(String, default="Tamil Nadu")
    pincode = Column(String)
    contact_email = Column(String)
    contact_phone = Column(String)
    logo_url = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Multi-Entity / Group Company Management
    parent_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    is_parent = Column(Boolean, default=False)
    data_region = Column(String, default="India") # India, EU, US, etc.
    
    # SaaS Fields
    plan = Column(SQLEnum(SubscriptionPlan), default=SubscriptionPlan.FREE)
    subscription_status = Column(SQLEnum(SubscriptionStatus), default=SubscriptionStatus.TRIAL)
    subscription_expiry = Column(DateTime(timezone=True))
    
    # Global Settings
    country = Column(String, default="India")
    base_currency = Column(String, default="INR") # INR, USD, AED, etc.
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    departments = relationship("Department", back_populates="company")
    employees = relationship("Employee", back_populates="company")


class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String, nullable=False)
    code = Column(String, unique=True)
    budget = Column(Numeric(precision=15, scale=2), default=0)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    company = relationship("Company", back_populates="departments")
    employees = relationship("Employee", back_populates="department")
