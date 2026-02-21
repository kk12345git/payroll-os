from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, employees, departments, attendance, leaves, payroll, companies, anomalies, ewa, tax_optimizer, whatsapp, copilot, analytics, compliance, billing, admin, invitations, me
from app.core.database import engine, Base
from app.core.security_middleware import SecurityHardeningMiddleware

# Create database tables
Base.metadata.create_all(bind=engine) # Triggers table creation on startup


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise-grade Payroll Management System with Indian Statutory Compliance"
)

# Configure CORS - Must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Apply Security Hardening
app.add_middleware(SecurityHardeningMiddleware)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(employees.router, prefix="/api/employees", tags=["Employees"])
app.include_router(departments.router, prefix="/api/departments", tags=["Departments"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(leaves.router, prefix="/api/leaves", tags=["Leaves"])
app.include_router(payroll.router, prefix="/api/payroll", tags=["Payroll"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(anomalies.router, prefix="/api/anomalies", tags=["Anomalies"])
app.include_router(ewa.router, prefix="/api/ewa", tags=["Earned Wage Access"])
app.include_router(tax_optimizer.router, prefix="/api/tax-optimizer", tags=["Tax Optimizer"])
app.include_router(whatsapp.router, prefix="/api/integrations/whatsapp", tags=["WhatsApp Integration"])
app.include_router(copilot.router, prefix="/api/copilot", tags=["AI Copilot"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics & AI"])
app.include_router(compliance.router, prefix="/api/compliance", tags=["Compliance & Filing"])
app.include_router(billing.router, prefix="/api/billing", tags=["Payments & Billing"])
app.include_router(admin.router, prefix="/api/admin", tags=["Internal Admin"])
app.include_router(invitations.router, prefix="/api/invites", tags=["Staff Invitations"])
app.include_router(me.router, prefix="/api/me", tags=["Employee Self-Service"])


@app.get("/")
async def root():
    return {
        "message": "Payroll Management System API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
