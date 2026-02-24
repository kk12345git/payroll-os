from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./payroll.db"
    
    # Custom init to debug environment variables in production
    def __init__(self, **values):
        super().__init__(**values)
        import os
        env_val = os.getenv("DATABASE_URL")
        if env_val:
            print(f"--- ENVIRONMENT DIAGNOSTIC ---")
            print(f"DATABASE_URL found in OS env (length: {len(env_val)})")
            # Force override if it starts with postgres or if currently using default sqlite
            if env_val.startswith("postgres") or self.DATABASE_URL == "sqlite:///./payroll.db":
                 self.DATABASE_URL = env_val
                 print(f"Applied production DATABASE_URL from environment")
            print(f"-----------------------------")
        else:
            print("--- ENVIRONMENT DIAGNOSTIC ---")
            print("DATABASE_URL NOT FOUND in OS environment!")
            # Ensure it's not empty even if env is missing
            if not self.DATABASE_URL or self.DATABASE_URL.strip() == "":
                self.DATABASE_URL = "sqlite:///./payroll.db"
                print("Restored default sqlite path")
            print(f"Current DATABASE_URL in settings: {self.DATABASE_URL}")
            print(f"-----------------------------")
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Email
    SENDGRID_API_KEY: Optional[str] = None
    FROM_EMAIL: str = "noreply@yourcompany.com"
    
    # Celery & Redis
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Application
    APP_NAME: str = "AutoPay-OS AutoPay-OS System"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Global SaaS
    FRONTEND_URL: str = "http://localhost:3000"
    STRIPE_API_KEY: Optional[str] = None
    STRIPE_PRICE_ID_INDIA: str = "price_india_4999"  # ₹4,999
    STRIPE_PRICE_ID_GLOBAL: str = "price_global_99"   # $99
    
    # Indian Compliance Settings
    PF_EMPLOYEE_RATE: float = 0.12
    PF_EMPLOYER_EPF_RATE: float = 0.0367
    PF_EMPLOYER_EPS_RATE: float = 0.0833
    PF_WAGE_CEILING: int = 15000
    PF_INTEREST_RATE: float = 0.0825
    
    ESI_EMPLOYEE_RATE: float = 0.0075
    ESI_EMPLOYER_RATE: float = 0.0325
    ESI_WAGE_CEILING: int = 21000
    ESI_DAILY_WAGE_EXEMPTION: int = 176
    
    PT_MAX_ANNUAL: int = 2500
    PT_STATE: str = "TAMIL_NADU"
    
    CURRENT_FY: str = "2025-26"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
