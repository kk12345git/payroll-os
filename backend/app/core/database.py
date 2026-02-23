from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create SQLAlchemy engine
# Automatically fix 'postgres://' to 'postgresql://' for SQLAlchemy compatibility
import os
db_url = os.getenv("DATABASE_URL") or settings.DATABASE_URL

if not db_url:
    print("❌ CRITICAL: DATABASE_URL is empty! Check Railway environment variables.")
    # Fallback to sqlite if totally empty to prevent hard crash during healthcheck if desired, 
    # but for production it's better to know why it's failing.
    db_url = "sqlite:///./production_fallback.db"

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

print(f"📡 Using Database URL: {db_url.split('@')[-1] if '@' in db_url else db_url}") # Log host only for safety

is_sqlite = "sqlite" in db_url
engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False} if is_sqlite else {},
    pool_pre_ping=True,
    echo=settings.ENVIRONMENT == "development"
)


# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
