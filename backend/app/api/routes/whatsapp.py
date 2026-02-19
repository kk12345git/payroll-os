from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.services.whatsapp_service import WhatsAppService

router = APIRouter()

class WhatsAppMessage(BaseModel):
    phone: str
    message: str

@router.post("/webhook")
async def whatsapp_webhook(
    payload: WhatsAppMessage,
    db: Session = Depends(get_db)
):
    """
    Simulates a webhook receiving a message from WhatsApp/Twilio.
    Returns the bot's response text.
    """
    response_text = WhatsAppService.process_message(db, payload.phone, payload.message)
    return {"response": response_text}
