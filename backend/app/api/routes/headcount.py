"""
Headcount Planning & Workforce Strategy API Routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel

from app.core.database import get_db
from app.api import dependencies
from app.models.user import User
from app.models.employee import Employee
from app.models.company import Department
from app.models.autopay_os import AutoPayOSRecord, AutoPayOSStatus
from app.models.headcount import (
    HeadcountPlan, RoleRequisition, WorkforceScenario,
    RequisitionStatus, RequisitionPriority, ScenarioType
)

router = APIRouter()


# ---- Schemas ----

class PlanCreate(BaseModel):
    title: str
    period: str
    department_id: Optional[int] = None
    current_headcount: int = 0
    target_headcount: int = 0
    approved_budget: float = 0.0
    notes: Optional[str] = None


class PlanResponse(BaseModel):
    id: int
    title: str
    period: str
    department_id: Optional[int]
    current_headcount: int
    target_headcount: int
    approved_budget: float
    hires_needed: int = 0
    is_approved: bool
    requisition_count: int = 0
    filled_count: int = 0
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class RequisitionCreate(BaseModel):
    job_title: str
    job_level: Optional[str] = None
    job_type: str = "full_time"
    location: Optional[str] = None
    is_remote: bool = False
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    target_start_date: Optional[date] = None
    priority: RequisitionPriority = RequisitionPriority.MEDIUM
    justification: Optional[str] = None
    skills_required: Optional[str] = None
    plan_id: Optional[int] = None
    department_id: Optional[int] = None


class RequisitionUpdate(BaseModel):
    status: Optional[RequisitionStatus] = None
    priority: Optional[RequisitionPriority] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    justification: Optional[str] = None


class RequisitionResponse(BaseModel):
    id: int
    job_title: str
    job_level: Optional[str]
    job_type: str
    location: Optional[str]
    is_remote: bool
    min_salary: Optional[float]
    max_salary: Optional[float]
    target_start_date: Optional[date]
    status: RequisitionStatus
    priority: RequisitionPriority
    justification: Optional[str]
    skills_required: Optional[str]
    plan_id: Optional[int]
    department_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class ScenarioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    scenario_type: ScenarioType = ScenarioType.GROWTH
    growth_rate_pct: float = 0.0
    attrition_rate_pct: float = 10.0
    salary_increase_pct: float = 0.0
    timeframe_months: int = 12


class ScenarioResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    scenario_type: ScenarioType
    growth_rate_pct: float
    attrition_rate_pct: float
    salary_increase_pct: float
    timeframe_months: int
    projected_headcount: Optional[int]
    projected_cost: Optional[float]
    net_hires_needed: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# ---- Headcount Plan Endpoints ----

@router.post("/plans", response_model=PlanResponse)
async def create_plan(
    plan: PlanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin/HR) Creates a headcount plan for a period/department."""
    new_plan = HeadcountPlan(
        company_id=current_user.company_id,
        created_by=current_user.id,
        **plan.model_dump()
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return _plan_to_response(new_plan)


@router.get("/plans", response_model=List[PlanResponse])
async def list_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    plans = db.query(HeadcountPlan).filter(
        HeadcountPlan.company_id == current_user.company_id
    ).order_by(HeadcountPlan.created_at.desc()).all()
    return [_plan_to_response(p) for p in plans]


@router.patch("/plans/{plan_id}/approve")
async def approve_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """(Admin) Approves a headcount plan."""
    plan = db.query(HeadcountPlan).filter(
        HeadcountPlan.id == plan_id,
        HeadcountPlan.company_id == current_user.company_id
    ).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found.")
    plan.is_approved = True
    db.commit()
    return {"detail": "Plan approved."}


# ---- Requisition Endpoints ----

@router.post("/requisitions", response_model=RequisitionResponse)
async def create_requisition(
    req: RequisitionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Creates a new role requisition (open position)."""
    new_req = RoleRequisition(
        company_id=current_user.company_id,
        created_by=current_user.id,
        **req.model_dump()
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req


@router.get("/requisitions", response_model=List[RequisitionResponse])
async def list_requisitions(
    status: Optional[RequisitionStatus] = None,
    priority: Optional[RequisitionPriority] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns all role requisitions, with optional filters."""
    query = db.query(RoleRequisition).filter(
        RoleRequisition.company_id == current_user.company_id
    )
    if status:
        query = query.filter(RoleRequisition.status == status)
    if priority:
        query = query.filter(RoleRequisition.priority == priority)
    if department_id:
        query = query.filter(RoleRequisition.department_id == department_id)
    return query.order_by(RoleRequisition.created_at.desc()).all()


@router.patch("/requisitions/{req_id}", response_model=RequisitionResponse)
async def update_requisition(
    req_id: int,
    update: RequisitionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Updates a requisition's status or details."""
    req = db.query(RoleRequisition).filter(
        RoleRequisition.id == req_id,
        RoleRequisition.company_id == current_user.company_id
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requisition not found.")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(req, field, value)
    db.commit()
    db.refresh(req)
    return req


# ---- Workforce Scenario Modeling ----

@router.post("/scenarios", response_model=ScenarioResponse)
async def create_scenario(
    scenario: ScenarioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Creates and simulates a workforce planning scenario."""
    # Fetch current real data
    current_headcount = db.query(func.count(Employee.id)).filter(
        Employee.company_id == current_user.company_id,
        Employee.is_active == True
    ).scalar() or 0

    avg_salary = db.query(func.avg(AutoPayOSRecord.gross_earnings)).filter(
        AutoPayOSRecord.company_id == current_user.company_id,
        AutoPayOSRecord.status == AutoPayOSStatus.PAID
    ).scalar() or 0

    # Run simulation:
    # projected headcount = current + growth - attrition
    attrition_loss = round(current_headcount * (scenario.attrition_rate_pct / 100))
    growth_hires = round(current_headcount * (scenario.growth_rate_pct / 100))
    projected_headcount = current_headcount + growth_hires - attrition_loss
    net_hires_needed = max(0, growth_hires)  # Net new hires needed

    # Projected monthly cost
    new_avg_salary = float(avg_salary) * (1 + scenario.salary_increase_pct / 100)
    projected_monthly = projected_headcount * new_avg_salary
    projected_annual = projected_monthly * 12

    new_scenario = WorkforceScenario(
        company_id=current_user.company_id,
        created_by=current_user.id,
        projected_headcount=projected_headcount,
        projected_cost=round(projected_annual, 2),
        net_hires_needed=net_hires_needed,
        **scenario.model_dump()
    )
    db.add(new_scenario)
    db.commit()
    db.refresh(new_scenario)
    return new_scenario


@router.get("/scenarios", response_model=List[ScenarioResponse])
async def list_scenarios(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    return db.query(WorkforceScenario).filter(
        WorkforceScenario.company_id == current_user.company_id,
        WorkforceScenario.is_active == True
    ).order_by(WorkforceScenario.created_at.desc()).all()


# ---- Workforce Intelligence Dashboard ----

@router.get("/dashboard")
async def headcount_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns full workforce intelligence data for the dashboard."""
    cid = current_user.company_id

    # Headcount totals
    total_active = db.query(func.count(Employee.id)).filter(
        Employee.company_id == cid, Employee.is_active == True
    ).scalar() or 0

    # Dept-wise distribution
    dept_dist = db.query(
        Department.name,
        func.count(Employee.id).label("count")
    ).join(Employee, Employee.department_id == Department.id).filter(
        Department.company_id == cid, Employee.is_active == True
    ).group_by(Department.name).all()

    # Avg salary per dept
    dept_salary = db.query(
        Department.name,
        func.avg(AutoPayOSRecord.gross_earnings).label("avg_salary"),
        func.sum(AutoPayOSRecord.gross_earnings).label("total_salary")
    ).join(Employee, Employee.department_id == Department.id) \
     .join(AutoPayOSRecord, AutoPayOSRecord.employee_id == Employee.id) \
     .filter(Department.company_id == cid) \
     .group_by(Department.name).all()

    # Open requisitions
    open_reqs = db.query(func.count(RoleRequisition.id)).filter(
        RoleRequisition.company_id == cid,
        RoleRequisition.status.in_([RequisitionStatus.APPROVED, RequisitionStatus.IN_PROGRESS])
    ).scalar() or 0

    critical_reqs = db.query(func.count(RoleRequisition.id)).filter(
        RoleRequisition.company_id == cid,
        RoleRequisition.priority == RequisitionPriority.CRITICAL,
        RoleRequisition.status != RequisitionStatus.FILLED
    ).scalar() or 0

    # Requisition status breakdown
    req_by_status = db.query(
        RoleRequisition.status,
        func.count(RoleRequisition.id).label("count")
    ).filter(RoleRequisition.company_id == cid).group_by(RoleRequisition.status).all()

    # Recent hires (employees joined in last 90 days)
    ninety_days_ago = datetime.utcnow().date()
    from datetime import timedelta
    ninety_days_ago = (datetime.utcnow() - timedelta(days=90)).date()
    recent_hires = db.query(func.count(Employee.id)).filter(
        Employee.company_id == cid,
        Employee.date_of_joining >= ninety_days_ago
    ).scalar() or 0

    # Total payroll cost
    total_payroll = db.query(func.avg(AutoPayOSRecord.gross_earnings)).filter(
        AutoPayOSRecord.company_id == cid,
        AutoPayOSRecord.status == AutoPayOSStatus.PAID
    ).scalar() or 0

    return {
        "summary": {
            "total_active": total_active,
            "open_requisitions": open_reqs,
            "critical_roles": critical_reqs,
            "recent_hires_90d": recent_hires,
            "avg_monthly_salary": round(float(total_payroll), 2),
            "monthly_payroll_burn": round(float(total_payroll) * total_active, 2),
        },
        "dept_distribution": [
            {"dept": d.name, "count": d.count} for d in dept_dist
        ],
        "dept_salary": [
            {
                "dept": d.name,
                "avg_salary": round(float(d.avg_salary), 0) if d.avg_salary else 0,
                "total_salary": round(float(d.total_salary), 0) if d.total_salary else 0
            }
            for d in dept_salary
        ],
        "requisitions_by_status": {
            str(r.status): r.count for r in req_by_status
        }
    }


# ---- Org Chart Data ----

@router.get("/org-chart")
async def get_org_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(dependencies.get_current_user)
):
    """Returns department → employee hierarchy for org chart rendering."""
    cid = current_user.company_id
    depts = db.query(Department).filter(Department.company_id == cid).all()
    chart = []
    for dept in depts:
        employees = db.query(Employee).filter(
            Employee.company_id == cid,
            Employee.department_id == dept.id,
            Employee.is_active == True
        ).all()
        chart.append({
            "dept_id": dept.id,
            "dept_name": dept.name,
            "headcount": len(employees),
            "members": [
                {
                    "id": e.id,
                    "name": e.full_name,
                    "designation": e.designation,
                    "date_of_joining": str(e.date_of_joining) if e.date_of_joining else None,
                }
                for e in employees
            ]
        })
    return chart


# ---- Helpers ----

def _plan_to_response(plan: HeadcountPlan) -> PlanResponse:
    filled = len([r for r in plan.requisitions if r.status == RequisitionStatus.FILLED])
    return PlanResponse(
        id=plan.id, title=plan.title, period=plan.period,
        department_id=plan.department_id,
        current_headcount=plan.current_headcount,
        target_headcount=plan.target_headcount,
        approved_budget=plan.approved_budget,
        hires_needed=max(0, plan.target_headcount - plan.current_headcount),
        is_approved=plan.is_approved,
        requisition_count=len(plan.requisitions),
        filled_count=filled,
        notes=plan.notes,
        created_at=plan.created_at
    )
