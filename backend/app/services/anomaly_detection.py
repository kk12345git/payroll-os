from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from app.models.autopay_os import AutoPayOSRecord, AutoPayOSStatus
from app.models.anomaly import Anomaly, AnomalyType, AnomalySeverity
from app.models.employee import Employee

class AnomalyDetectionService:
    @staticmethod
    def analyze_autopay_os_record(db: Session, record: AutoPayOSRecord) -> List[Anomaly]:
        anomalies = []
        
        # 1. Salary Spike Detection (> 20% increase from previous month)
        # Fix: Fetching the employee via ID since record.employee might not be loaded
        employee = db.query(Employee).filter(Employee.id == record.employee_id).first()
        if not employee:
            return []

        previous_record = db.query(AutoPayOSRecord).filter(
            AutoPayOSRecord.employee_id == record.employee_id,
            AutoPayOSRecord.status == AutoPayOSStatus.PAID,
            (AutoPayOSRecord.year * 12 + AutoPayOSRecord.month) < (record.year * 12 + record.month)
        ).order_by(AutoPayOSRecord.year.desc(), AutoPayOSRecord.month.desc()).first()
        
        if previous_record and previous_record.gross_earnings > 0:
            diff_percent = (record.gross_earnings - previous_record.gross_earnings) / previous_record.gross_earnings * 100
            if diff_percent > 20:
                anomalies.append(Anomaly(
                    company_id=employee.company_id,
                    employee_id=record.employee_id,
                    autopay_os_record_id=record.id,
                    type=AnomalyType.SALARY_SPIKE,
                    severity=AnomalySeverity.HIGH,
                    title="Significant Salary Spike Detected",
                    description=f"Gross pay increased by {diff_percent:.2f}% compared to last pay cycle.",
                    data={
                        "previous_gross": float(previous_record.gross_earnings),
                        "current_gross": float(record.gross_earnings),
                        "diff_percent": float(diff_percent)
                    }
                ))

        # 2. Compliance: Missing PF check (> 15k INR)
        if record.gross_earnings > 15000 and (not record.pf_deduction or record.pf_deduction == 0):
             anomalies.append(Anomaly(
                company_id=employee.company_id,
                employee_id=record.employee_id,
                autopay_os_record_id=record.id,
                type=AnomalyType.COMPLIANCE_MISMATCH,
                severity=AnomalySeverity.MEDIUM,
                title="Potential PF Compliance Issue",
                description="Salary exceeds 15,000 INR but no PF deduction was found.",
                data={"gross": float(record.gross_earnings)}
            ))

        # 3. Income Tax Anomaly
        if record.gross_earnings > 100000 and (not record.income_tax_deduction or record.income_tax_deduction < (record.gross_earnings * Decimal('0.05'))):
             anomalies.append(Anomaly(
                company_id=employee.company_id,
                employee_id=record.employee_id,
                autopay_os_record_id=record.id,
                type=AnomalyType.TAX_ANOMALY,
                severity=AnomalySeverity.HIGH,
                title="Abnormally Low TDS Deduction",
                description="High salary detected with less than 5% TDS.",
                data={"gross": float(record.gross_earnings), "tds": float(record.income_tax_deduction or 0)}
            ))

        if anomalies:
            for anomaly in anomalies:
                db.add(anomaly)
            db.commit()
            
        return anomalies

    @staticmethod
    def get_company_anomalies(db: Session, company_id: int, resolved: Optional[bool] = None) -> List[Anomaly]:
        query = db.query(Anomaly).filter(Anomaly.company_id == company_id)
        if resolved is not None:
            query = query.filter(Anomaly.is_resolved == resolved)
        return query.order_by(Anomaly.created_at.desc()).all()
