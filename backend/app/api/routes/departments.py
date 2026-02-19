from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.company import Department
from app.schemas.department import DepartmentCreate, DepartmentUpdate, Department as DepartmentSchema
from app.api import dependencies
from app.models.user import UserRole

router = APIRouter()

@router.get("/", response_model=List[DepartmentSchema])
def read_departments(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.get_current_user)
):
    departments = db.query(Department).offset(skip).limit(limit).all()
    return departments

@router.post("/", response_model=DepartmentSchema, status_code=status.HTTP_201_CREATED)
def create_department(
    department: DepartmentCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    # Check if code already exists
    if department.code:
        db_dept = db.query(Department).filter(Department.code == department.code).first()
        if db_dept:
            raise HTTPException(status_code=400, detail="Department code already registered")
    
    db_department = Department(**department.model_dump())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@router.get("/{department_id}", response_model=DepartmentSchema)
def read_department(
    department_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.get_current_user)
):
    db_department = db.query(Department).filter(Department.id == department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    return db_department

@router.put("/{department_id}", response_model=DepartmentSchema)
def update_department(
    department_id: int, 
    department: DepartmentUpdate, 
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.require_role(UserRole.HR_MANAGER))
):
    db_department = db.query(Department).filter(Department.id == department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    update_data = department.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_department, key, value)
    
    db.commit()
    db.refresh(db_department)
    return db_department

@router.delete("/{department_id}")
def delete_department(
    department_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.require_role(UserRole.ADMIN))
):
    db_department = db.query(Department).filter(Department.id == department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")
    
    db.delete(db_department)
    db.commit()
    return {"message": "Department deleted successfully"}
