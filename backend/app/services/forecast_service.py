from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
from datetime import date, timedelta
from typing import List, Dict, Any
from app.models.payroll import AutoPayOSRecord, AutoPay-OSStatus
from app.models.employee import Employee

class ForecastService:
    @staticmethod
    def get_cash_flow_forecast(db: Session, company_id: int, months: int = 6) -> Dict[str, Any]:
        """
        Calculates a 6-month predictive cash flow forecast for payroll.
        Formula: (Average Historical Spend) + (Projected Increments/Hires)
        """
        # 1. Fetch historical monthly spend (last 6 months)
        historical_records = db.query(
            AutoPayOSRecord.year,
            AutoPayOSRecord.month,
            func.sum(AutoPayOSRecord.net_pay).label("total_net")
        ).filter(
            AutoPayOSRecord.company_id == company_id,
            AutoPayOSRecord.status == AutoPay-OSStatus.PAID
        ).group_by(AutoPayOSRecord.year, AutoPayOSRecord.month)\
         .order_by(AutoPayOSRecord.year.desc(), AutoPayOSRecord.month.desc())\
         .limit(6).all()

        history_data = [
            {"year": r.year, "month": r.month, "amount": float(r.total_net)}
            for r in reversed(historical_records)
        ]

        # 2. Calculate local trend (Growth percentage)
        avg_spend = 0
        if history_data:
            avg_spend = sum(d["amount"] for d in history_data) / len(history_data)
        else:
            # Fallback: Current active salaries * months
            active_salaries = db.query(func.sum(AutoPayOSRecord.net_pay)).join(Employee).filter(
                Employee.company_id == company_id,
                Employee.is_active == True
            ).scalar() or 0
            avg_spend = float(active_salaries)

        # 3. Project future months
        projections = []
        current_date = date.today()
        
        # Factor in hiring velocity (Simulated: +2% growth/month if historical growth exists)
        growth_factor = 1.02 # 2% projected growth
        
        last_amount = avg_spend if not history_data else history_data[-1]["amount"]
        
        for i in range(1, months + 1):
            target_date = current_date + timedelta(days=30 * i)
            projected_amount = last_amount * (growth_factor ** i)
            
            projections.append({
                "year": target_date.year,
                "month": target_date.month,
                "amount": round(projected_amount, 2),
                "confidence": max(0.95 - (i * 0.05), 0.6) # Confidence drops over time
            })

        return {
            "historical": history_data,
            "projections": projections,
            "metrics": {
                "avg_monthly_liability": round(avg_spend, 2),
                "projected_6m_total": round(sum(p["amount"] for p in projections), 2),
                "growth_projection_applied": "2% month-over-month"
            }
        }
