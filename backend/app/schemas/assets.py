from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import date, datetime

class AssetBase(BaseModel):
    asset_type: str
    model_name: Optional[str] = None
    serial_number: str
    status: Optional[str] = "In Stock"
    metadata_json: Optional[Dict[str, Any]] = {}

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int
    company_id: int
    employee_id: Optional[int] = None
    assigned_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentBase(BaseModel):
    title: str
    doc_type: Optional[str] = None
    expiry_date: Optional[date] = None

class DocumentCreate(DocumentBase):
    employee_id: Optional[int] = None
    file_path: str # In a real app, this would be the S3 URL / Local Path

class DocumentResponse(DocumentBase):
    id: int
    company_id: int
    employee_id: Optional[int] = None
    file_path: str
    is_encrypted: bool
    uploaded_by_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
