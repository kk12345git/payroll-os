from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.dependencies import get_current_user, require_role
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, Employee as EmployeeSchema
from app.services.bulk_import_service import BulkImportService

router = APIRouter()

@router.post("/bulk-import", status_code=status.HTTP_200_OK)
async def bulk_import_employees(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.HR_MANAGER))
):
    """Bulk import employees from Excel"""
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload an Excel file."
        )
    
    content = await file.read()
    # In a real app, we'd get company_id from current_user or a path param
    # For now, we'll assume the user's primary company or first one for demo
    company_id = 1 
    
    result = BulkImportService.process_employee_excel(content, company_id, db)
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result

@router.get("/", response_model=List[EmployeeSchema])
async def list_employees(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all employees"""
    employees = db.query(Employee).offset(skip).limit(limit).all()
    return employees

@router.post("/", response_model=EmployeeSchema, status_code=status.HTTP_201_CREATED)
async def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.HR_MANAGER))
):
    """Create a new employee"""
    # Check for duplicate email
    existing_email = db.query(Employee).filter(Employee.email == employee_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee with this email already exists"
        )
    
    # Check for duplicate PAN if provided
    if employee_data.pan_number:
        existing_pan = db.query(Employee).filter(Employee.pan_number == employee_data.pan_number).first()
        if existing_pan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee with this PAN number already exists"
            )

    # Create employee
    new_employee = Employee(**employee_data.model_dump())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    
    return new_employee

@router.get("/{employee_id}", response_model=EmployeeSchema)
async def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get employee by ID"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return employee

@router.put("/{employee_id}", response_model=EmployeeSchema)
async def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.HR_MANAGER))
):
    """Update employee information"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    # Update fields
    update_data = employee_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(employee, field, value)
    
    db.commit()
    db.refresh(employee)
    
    return employee

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    """Delete employee (soft delete - mark as inactive)"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    employee.is_active = False
    db.commit()
    
    return None
