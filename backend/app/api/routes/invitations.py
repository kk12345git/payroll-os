from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.employee import Employee
import secrets
import string

router = APIRouter()

@router.post("/generate-link")
async def generate_invite_link(
    email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """
    Generates a secure, temporary invite link for a new employee.
    In a real app, this tokens would be stored in an 'Invitations' table.
    """
    token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
    invite_url = f"http://localhost:3000/onboarding/join?token={token}&company={current_user.company_id}"
    
    # Simulate background task for sending email/WhatsApp
    print(f"Sending invite to {email}: {invite_url}")
    
    return {
        "invite_url": invite_url,
        "token": token,
        "expires_in": "48 hours"
    }

@router.get("/pending")
async def get_pending_invites(
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns a mock list of pending invites for this company."""
    return [
        {"email": "alex@client.com", "sent_at": "2026-02-18", "status": "PENDING"},
        {"email": "maya@global.io", "sent_at": "2026-02-19", "status": "EXPIRED"},
    ]
