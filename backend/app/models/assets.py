from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True) # Current holder
    
    asset_type = Column(String, nullable=False) # Laptop, Mobile, SIM, Access Card
    model_name = Column(String)
    serial_number = Column(String, unique=True, index=True)
    
    status = Column(String, default="In Stock") # In Stock, Assigned, Under Repair, Retired
    assigned_at = Column(DateTime(timezone=True))
    
    metadata_json = Column(JSON, default={}) # For extra details like RAM, IMEI, etc.
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    employee = relationship("Employee")
    company = relationship("Company")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True) # Linked employee (if personal)
    
    title = Column(String, nullable=False)
    doc_type = Column(String) # Passport, Contract, ID Proof
    file_path = Column(String, nullable=False) # Local or Cloud URL
    
    expiry_date = Column(Date, nullable=True)
    is_encrypted = Column(Boolean, default=True)
    
    uploaded_by_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    employee = relationship("Employee")
    uploaded_by = relationship("User")
