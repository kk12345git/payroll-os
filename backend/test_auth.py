
import sys
import os
sys.path.append(os.getcwd())

from app.core.security import create_access_token
from app.api.dependencies import get_current_user
from app.core.database import SessionLocal
import asyncio

async def test():
    db = SessionLocal()
    try:
        # Create a dummy token for user ID 1
        token = create_access_token(data={"sub": "1"})
        print(f"Token: {token}")
        
        # Test dependency
        user = await get_current_user(token=token, db=db)
        print(f"User found: {user.email}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test())
