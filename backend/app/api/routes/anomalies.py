from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.core.database import get_db
from app.api import dependencies
from app.models.anomaly import Anomaly, AnomalyType, AnomalySeverity
from app.services.anomaly_detection import AnomalyDetectionService

router = APIRouter()

class AnomalyResponse(BaseModel):
    id: int
    type: AnomalyType
    severity: AnomalySeverity
    title: String
    description: Optional[str]
    data: Optional[dict]
    is_resolved: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[AnomalyResponse])
def get_anomalies(
    resolved: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.get_current_user)
):
    """Fetch all anomalies for the user's company"""
    return AnomalyDetectionService.get_company_anomalies(db, current_user.company_id, resolved)

@router.put("/{anomaly_id}/resolve")
def resolve_anomaly(
    anomaly_id: int,
    notes: str,
    db: Session = Depends(get_db),
    current_user = Depends(dependencies.get_current_user)
):
    """Mark an anomaly as resolved"""
    anomaly = db.query(Anomaly).filter(
        Anomaly.id == anomaly_id, 
        Anomaly.company_id == current_user.company_id
    ).first()
    
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
        
    anomaly.is_resolved = True
    anomaly.resolved_by_id = current_user.id
    anomaly.resolution_notes = notes
    
    db.commit()
    return {"status": "resolved"}
