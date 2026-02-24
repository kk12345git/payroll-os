from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class MaritalStatus(str, enum.Enum):
    SINGLE = "single"
    MARRIED = "married"
    DIVORCED = "divorced"
    WIDOWED = "widowed"


class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Personal Information
    employee_code = Column(String, unique=True, nullable=False, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String)
    date_of_birth = Column(Date)
    gender = Column(SQLEnum(Gender))
    marital_status = Column(SQLEnum(MaritalStatus))
    
    # Address
    address = Column(String)
    city = Column(String)
    state = Column(String)
    pincode = Column(String)
    
    # Employment Details
    designation = Column(String)
    date_of_joining = Column(Date, nullable=False)
    date_of_leaving = Column(Date, nullable=True)
    employment_type = Column(String)  # Full-time, Part-time, Contract
    
    # KYC Information
    pan_number = Column(String, unique=True)
    aadhaar_number = Column(String, unique=True)
    uan_number = Column(String, unique=True)  # Universal Account Number for PF
    esi_number = Column(String, unique=True)
    bank_account_number = Column(String)
    bank_ifsc_code = Column(String)
    bank_name = Column(String)
    
    # Tax Information
    tax_regime = Column(String, default="new")  # new or old
    is_senior_citizen = Column(Boolean, default=False)
    is_disabled = Column(Boolean, default=False)
    disability_percentage = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    company = relationship("Company", back_populates="employees")
    department = relationship("Department", back_populates="employees")
    attendance_records = relationship("Attendance", back_populates="employee")
    leave_applications = relationship("LeaveApplication", back_populates="employee")
    user = relationship("User")
    salary_structure = relationship("SalaryStructure", back_populates="employee", uselist=False)
    payroll_records = relationship("AutoPayOSRecord", back_populates="employee")
