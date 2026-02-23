from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.assets import Asset, Document
from app.schemas.assets import AssetCreate, AssetResponse, DocumentCreate, DocumentResponse

router = APIRouter()

# --- Asset Management ---

@router.post("/hardware", response_model=AssetResponse)
async def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Registers a new company asset (Laptop, Mobile, etc.)"""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
        
    new_asset = Asset(
        company_id=current_user.company_id,
        **asset.model_dump()
    )
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    return new_asset

@router.get("/hardware", response_model=List[AssetResponse])
async def list_assets(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Returns all assets belonging to the company."""
    return db.query(Asset).filter(Asset.company_id == current_user.company_id).all()

@router.post("/hardware/{asset_id}/assign/{employee_id}")
async def assign_asset(
    asset_id: int,
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Assigns a specific asset to an employee."""
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.company_id == current_user.company_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found.")
        
    asset.employee_id = employee_id
    asset.status = "Assigned"
    asset.assigned_at = func.now() if hasattr(func, 'now') else None
    
    db.commit()
    return {"message": "Asset assigned successfully"}

# --- Document Vault ---

@router.post("/vault", response_model=DocumentResponse)
async def upload_document(
    doc: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Adds a document reference to the vault."""
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User not associated with a company.")
        
    new_doc = Document(
        company_id=current_user.company_id,
        uploaded_by_id=current_user.id,
        **doc.model_dump()
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.get("/vault", response_model=List[DocumentResponse])
async def list_documents(
    employee_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Lists all documents in the company vault."""
    query = db.query(Document).filter(Document.company_id == current_user.company_id)
    if employee_id:
        query = query.filter(Document.employee_id == employee_id)
    return query.all()
