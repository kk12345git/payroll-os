from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create SQLAlchemy engine
# Handle Railway/Render Postgres URL (postgres:// vs postgresql://)
import os
db_url = os.getenv("DATABASE_URL") or settings.DATABASE_URL
print(f"--- DATABASE DIAGNOSTIC ---")
print(f"Raw DB URL length: {len(db_url) if db_url else 0}")

if not db_url or db_url.strip() == "":
    print("❌ CRITICAL: DATABASE_URL is empty! Check Railway environment variables.")
    # Use a safe fallback for local development if everything fails
    SQLALCHEMY_DATABASE_URL = "sqlite:///./production_fallback.db"
    print(f"📡 Using Database URL: {SQLALCHEMY_DATABASE_URL}")
else:
    if db_url.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = db_url.replace("postgres://", "postgresql://", 1)
        print("✅ Corrected postgres:// to postgresql://")
    else:
        SQLALCHEMY_DATABASE_URL = db_url
    print(f"📡 Database URL configured (scheme: {SQLALCHEMY_DATABASE_URL.split(':')[0]})")
print(f"---------------------------")

is_sqlite = "sqlite" in SQLALCHEMY_DATABASE_URL
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
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
