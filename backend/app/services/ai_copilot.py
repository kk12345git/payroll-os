"""
Upgraded AI HR Copilot Service — 20+ HR commands, flight risk, offer drafting,
compensation gap, team health, leave abuse detection, and smart suggestions.
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
from typing import Dict, Any, List, Optional
import re
from datetime import datetime, timedelta

from app.models.employee import Employee
from app.models.autopay_os import AutoPayOSRecord, AutoPayOSStatus
from app.models.company import Department
from app.models.attendance import Attendance
from app.models.leave import LeaveApplication, LeaveStatus
from app.models.performance import OKRGoal, FeedbackReview


class AICopilotService:

    # ----- Master Dispatcher -----

    @staticmethod
    def query(db: Session, company_id: int, query_text: str) -> Dict[str, Any]:
        text = query_text.lower().strip()

        # --- Payroll & Budget ---
        if any(w in text for w in ["forecast", "predict", "next month", "budget"]):
            return AICopilotService._forecast_budget(db, company_id)

        if any(w in text for w in ["total salary", "total payroll", "total cost", "total spend"]):
            return AICopilotService._total_payroll(db, company_id)

        if any(w in text for w in ["highest paid", "top earner", "highest salary"]):
            return AICopilotService._highest_paid(db, company_id)

        if any(w in text for w in ["lowest paid", "bottom earner", "lowest salary"]):
            return AICopilotService._lowest_paid(db, company_id)

        if "department" in text and any(w in text for w in ["breakdown", "cost", "spend"]):
            return AICopilotService._dept_breakdown(db, company_id)

        sim_match = re.search(r"(\d+)%\s+hike", text)
        if sim_match:
            pct = int(sim_match.group(1))
            dept_name = AICopilotService._extract_dept(db, company_id, text)
            return AICopilotService._simulate_hike(db, company_id, pct, dept_name)

        # --- Compensation Gap Analysis ---
        if any(w in text for w in ["compensation gap", "pay gap", "salary gap", "underpaid", "overpaid"]):
            return AICopilotService._compensation_gap(db, company_id)

        # --- Headcount ---
        if any(w in text for w in ["how many", "count", "headcount", "employees", "staff"]):
            return AICopilotService._headcount(db, company_id)

        # --- Attrition & Flight Risk ---
        if any(w in text for w in ["attrition", "quit", "resign", "turnover", "retention"]):
            return AICopilotService._predict_attrition(db, company_id)

        if any(w in text for w in ["flight risk", "at risk", "warning", "disengaged"]):
            return AICopilotService._flight_risk_scores(db, company_id)

        # --- Leave Analysis ---
        if any(w in text for w in ["most leaves", "leave abuse", "leave pattern", "who took most"]):
            return AICopilotService._top_leave_takers(db, company_id)

        if any(w in text for w in ["leave balance", "pending leave", "leave remaining"]):
            return AICopilotService._leave_overview(db, company_id)

        # --- Attendance ---
        if any(w in text for w in ["attendance", "late", "absent", "regularize"]):
            return AICopilotService._attendance_summary(db, company_id)

        # --- Performance ---
        if any(w in text for w in ["performance", "okr", "goal", "review", "rating"]):
            return AICopilotService._performance_summary(db, company_id)

        if any(w in text for w in ["top performer", "best performing", "star employee"]):
            return AICopilotService._top_performers(db, company_id)

        # --- Offer Letter Draft ---
        if any(w in text for w in ["offer letter", "draft offer", "write offer", "generate offer"]):
            # Try to extract a name from the query
            name_match = re.search(r"for\s+([A-Za-z\s]+)", query_text.strip())
            candidate_name = name_match.group(1).strip() if name_match else "the candidate"
            return AICopilotService._draft_offer_letter(db, company_id, candidate_name)

        # --- Team Health ---
        if any(w in text for w in ["team health", "company health", "overall health", "workforce health"]):
            return AICopilotService._team_health_report(db, company_id)

        # --- Hiring / Headcount Recommendation ---
        if any(w in text for w in ["hire", "hiring", "should we hire", "add headcount"]):
            return AICopilotService._hiring_recommendation(db, company_id)

        # --- Default / Help ---
        return {
            "answer": (
                "🤖 **AutoPay-OS HR Copilot** — Here's what I can help with:\n\n"
                "💰 **Payroll:** `total salary`, `highest paid`, `lowest paid`, `department cost`, `10% hike simulation`\n"
                "📊 **Analytics:** `forecast budget`, `compensation gap`, `headcount`\n"
                "⚠️ **Risk:** `attrition risk`, `flight risk`, `leave abuse`\n"
                "🏆 **Performance:** `top performers`, `OKR summary`, `performance ratings`\n"
                "📋 **HR Ops:** `leave overview`, `attendance summary`, `team health report`\n"
                "✍️ **AI Draft:** `draft offer letter for [Name]`"
            ),
            "type": "help",
            "suggestions": [
                "Who has the most leaves this month?",
                "Show me the flight risk report",
                "What is the compensation gap in Engineering?",
                "Draft an offer letter for Riya Sharma",
                "Forecast next month's payroll budget",
                "Who are the top performers?",
            ]
        }

    # ----- Payroll Helpers -----

    @staticmethod
    def _total_payroll(db: Session, company_id: int) -> Dict[str, Any]:
        cost = db.query(func.sum(AutoPayOSRecord.net_pay)).filter(
            AutoPayOSRecord.company_id == company_id,
            AutoPayOSRecord.status == AutoPayOSStatus.PAID
        ).scalar() or 0
        return {
            "answer": f"💰 Total net payroll disbursed across the company: **₹{float(cost):,.2f}**",
            "data": {"total_cost": float(cost)},
            "type": "metric"
        }

    @staticmethod
    def _highest_paid(db: Session, company_id: int) -> Dict[str, Any]:
        record = db.query(AutoPayOSRecord).filter(AutoPayOSRecord.company_id == company_id) \
            .order_by(AutoPayOSRecord.gross_earnings.desc()).first()
        if not record:
            return {"answer": "No payroll records found.", "type": "error"}
        name = db.query(Employee.full_name).filter(Employee.id == record.employee_id).scalar() or "Unknown"
        return {
            "answer": f"🏆 Highest earner is **{name}** with gross pay of **₹{float(record.gross_earnings):,.2f}**",
            "data": {"employee": name, "amount": float(record.gross_earnings)},
            "type": "entity"
        }

    @staticmethod
    def _lowest_paid(db: Session, company_id: int) -> Dict[str, Any]:
        record = db.query(AutoPayOSRecord).filter(AutoPayOSRecord.company_id == company_id) \
            .order_by(AutoPayOSRecord.gross_earnings.asc()).first()
        if not record:
            return {"answer": "No payroll records found.", "type": "error"}
        name = db.query(Employee.full_name).filter(Employee.id == record.employee_id).scalar() or "Unknown"
        return {
            "answer": f"📉 Lowest earner is **{name}** with gross pay of **₹{float(record.gross_earnings):,.2f}**",
            "data": {"employee": name, "amount": float(record.gross_earnings)},
            "type": "entity"
        }

    @staticmethod
    def _dept_breakdown(db: Session, company_id: int) -> Dict[str, Any]:
        results = db.query(
            Department.name, func.sum(AutoPayOSRecord.net_pay)
        ).join(Employee, Employee.department_id == Department.id) \
         .join(AutoPayOSRecord, AutoPayOSRecord.employee_id == Employee.id) \
         .filter(Department.company_id == company_id) \
         .group_by(Department.name).all()

        data = {r[0]: float(r[1]) for r in results}
        lines = "\n".join([f"- **{dept}**: ₹{cost:,.2f}" for dept, cost in sorted(data.items(), key=lambda x: -x[1])])
        return {
            "answer": f"📊 **Payroll Breakdown by Department:**\n{lines}",
            "data": data, "type": "chart"
        }

    @staticmethod
    def _forecast_budget(db: Session, company_id: int) -> Dict[str, Any]:
        avg_cost = db.query(func.avg(AutoPayOSRecord.net_pay)).filter(
            AutoPayOSRecord.company_id == company_id,
            AutoPayOSRecord.status == AutoPayOSStatus.PAID
        ).scalar() or 0
        forecast = float(avg_cost) * 1.05
        return {
            "answer": f"📈 Projected payroll budget for next month: **~₹{forecast:,.2f}** (avg + 5% buffer)",
            "data": {"forecasted_amount": forecast}, "type": "metric"
        }

    @staticmethod
    def _simulate_hike(db: Session, company_id: int, percent: int, dept_name: Optional[str]) -> Dict[str, Any]:
        query = db.query(func.sum(AutoPayOSRecord.net_pay)).filter(
            AutoPayOSRecord.company_id == company_id,
            AutoPayOSRecord.status == AutoPayOSStatus.PAID
        )
        if dept_name:
            query = query.join(Employee).join(Department).filter(Department.name == dept_name)
        current_cost = float(query.scalar() or 0)
        new_cost = current_cost * (1 + percent / 100)
        diff = new_cost - current_cost
        target = dept_name if dept_name else "entire company"
        return {
            "answer": f"💡 A **{percent}% hike** for {target} increases monthly cost by **₹{diff:,.2f}** → total: **₹{new_cost:,.2f}**",
            "data": {"increase": diff, "new_total": new_cost}, "type": "insight"
        }

    @staticmethod
    def _headcount(db: Session, company_id: int) -> Dict[str, Any]:
        count = db.query(func.count(Employee.id)).filter(
            Employee.company_id == company_id, Employee.is_active == True
        ).scalar()
        return {
            "answer": f"👥 You currently have **{count} active employees** on the platform.",
            "data": {"count": count}, "type": "metric"
        }

    # ----- Compensation Gap -----

    @staticmethod
    def _compensation_gap(db: Session, company_id: int) -> Dict[str, Any]:
        results = db.query(
            Department.name,
            func.avg(AutoPayOSRecord.gross_earnings).label("avg"),
            func.min(AutoPayOSRecord.gross_earnings).label("min"),
            func.max(AutoPayOSRecord.gross_earnings).label("max"),
            func.count(AutoPayOSRecord.id).label("cnt")
        ).join(Employee, Employee.department_id == Department.id) \
         .join(AutoPayOSRecord, AutoPayOSRecord.employee_id == Employee.id) \
         .filter(Department.company_id == company_id) \
         .group_by(Department.name).all()

        if not results:
            return {"answer": "No payroll data found for gap analysis.", "type": "error"}

        data = []
        lines = ["📊 **Compensation Gap Analysis by Department:**\n"]
        for r in results:
            gap_pct = ((float(r.max) - float(r.min)) / float(r.avg) * 100) if float(r.avg) > 0 else 0
            risk = "🔴 High" if gap_pct > 60 else "🟡 Medium" if gap_pct > 30 else "🟢 Low"
            lines.append(f"- **{r.name}**: Avg ₹{float(r.avg):,.0f} | Min ₹{float(r.min):,.0f} | Max ₹{float(r.max):,.0f} | Gap Risk: {risk}")
            data.append({"dept": r.name, "avg": float(r.avg), "min": float(r.min), "max": float(r.max), "gap_pct": round(gap_pct)})\

        return {"answer": "\n".join(lines), "data": data, "type": "chart"}

    # ----- Flight Risk -----

    @staticmethod
    def _flight_risk_scores(db: Session, company_id: int) -> Dict[str, Any]:
        """Multi-signal flight risk: leave frequency + attendance + join date + low ratings"""
        three_months_ago = datetime.now() - timedelta(days=90)
        one_year_ago = datetime.now() - timedelta(days=365)

        employees = db.query(Employee).filter(
            Employee.company_id == company_id, Employee.is_active == True
        ).all()

        risk_report = []
        for emp in employees:
            score = 0
            signals = []

            # Signal 1: High leave usage
            leave_days = db.query(func.sum(LeaveApplication.total_days)).filter(
                LeaveApplication.employee_id == emp.id,
                LeaveApplication.start_date >= three_months_ago.date(),
                LeaveApplication.status == LeaveStatus.APPROVED
            ).scalar() or 0
            if leave_days > 10:
                score += 35
                signals.append(f"High leave ({int(leave_days)} days in 90 days)")
            elif leave_days > 6:
                score += 15
                signals.append(f"Above-avg leave ({int(leave_days)} days)")

            # Signal 2: Low attendance
            absent_count = db.query(func.count(Attendance.id)).filter(
                Attendance.employee_id == emp.id,
                Attendance.status == "absent",
                Attendance.date >= three_months_ago.date()
            ).scalar() or 0
            if absent_count > 8:
                score += 25
                signals.append(f"Frequent absences ({absent_count} days)")

            # Signal 3: Tenure < 1 year (new employees leave more)
            if emp.date_of_joining and emp.date_of_joining >= one_year_ago.date():
                score += 10
                signals.append("Tenure < 1 year")

            # Signal 4: Low performance rating
            avg_rating = db.query(func.avg(FeedbackReview.rating)).filter(
                FeedbackReview.employee_id == emp.id,
                FeedbackReview.company_id == company_id
            ).scalar()
            if avg_rating and avg_rating < 3:
                score += 20
                signals.append(f"Low avg rating ({avg_rating:.1f}/5)")

            if score > 0:
                risk_report.append({
                    "employee": emp.full_name,
                    "employee_id": emp.id,
                    "risk_score": min(score, 100),
                    "risk_level": "🔴 High" if score >= 50 else "🟡 Medium",
                    "signals": signals
                })

        risk_report.sort(key=lambda x: -x["risk_score"])

        if not risk_report:
            return {
                "answer": "✅ **No significant flight risk detected.** Your team engagement looks healthy!",
                "type": "insight"
            }

        lines = ["⚠️ **Flight Risk Report** (Multi-signal analysis):\n"]
        for r in risk_report[:10]:
            lines.append(f"- **{r['employee']}** — Risk Score: {r['risk_score']}/100 {r['risk_level']}")
            lines.append(f"  Signals: {', '.join(r['signals'])}")

        return {
            "answer": "\n".join(lines),
            "data": risk_report,
            "type": "alert"
        }

    # ----- Attrition Prediction -----

    @staticmethod
    def _predict_attrition(db: Session, company_id: int) -> Dict[str, Any]:
        three_months_ago = datetime.now() - timedelta(days=90)
        high_leave = db.query(
            Employee.full_name, func.sum(LeaveApplication.total_days).label("total")
        ).join(LeaveApplication).filter(
            Employee.company_id == company_id,
            LeaveApplication.start_date >= three_months_ago.date(),
            LeaveApplication.status == LeaveStatus.APPROVED
        ).group_by(Employee.id).having(func.sum(LeaveApplication.total_days) > 10).all()

        if not high_leave:
            return {
                "answer": "✅ **Low attrition risk** — attendance patterns are stable across the board.",
                "type": "insight"
            }

        lines = ["⚠️ **Potential Attrition Risk** (High leave pattern in last 90 days):\n"]
        data = []
        for emp in high_leave:
            lines.append(f"- **{emp[0]}**: {int(emp[1])} days leave → Recommend 1:1 check-in")
            data.append({"name": emp[0], "leave_days": int(emp[1])})

        return {"answer": "\n".join(lines), "data": data, "type": "alert"}

    # ----- Leave Helpers -----

    @staticmethod
    def _top_leave_takers(db: Session, company_id: int) -> Dict[str, Any]:
        this_month = datetime.now().replace(day=1).date()
        results = db.query(
            Employee.full_name, func.sum(LeaveApplication.total_days).label("total")
        ).join(LeaveApplication).filter(
            Employee.company_id == company_id,
            LeaveApplication.start_date >= this_month,
            LeaveApplication.status == LeaveStatus.APPROVED
        ).group_by(Employee.id).order_by(func.sum(LeaveApplication.total_days).desc()).limit(10).all()

        if not results:
            return {"answer": "📋 No approved leaves this month so far.", "type": "insight"}

        lines = ["📅 **Top Leave Takers This Month:**\n"]
        data = []
        for i, r in enumerate(results, 1):
            lines.append(f"{i}. **{r[0]}**: {int(r[1])} days")
            data.append({"name": r[0], "days": int(r[1])})

        return {"answer": "\n".join(lines), "data": data, "type": "chart"}

    @staticmethod
    def _leave_overview(db: Session, company_id: int) -> Dict[str, Any]:
        pending = db.query(func.count(LeaveApplication.id)).join(Employee).filter(
            Employee.company_id == company_id,
            LeaveApplication.status == LeaveStatus.PENDING
        ).scalar() or 0
        approved = db.query(func.count(LeaveApplication.id)).join(Employee).filter(
            Employee.company_id == company_id,
            LeaveApplication.status == LeaveStatus.APPROVED
        ).scalar() or 0
        return {
            "answer": f"📋 **Leave Overview:**\n- ⏳ Pending approval: **{pending}** requests\n- ✅ Approved this period: **{approved}** requests",
            "data": {"pending": pending, "approved": approved}, "type": "metric"
        }

    # ----- Attendance -----

    @staticmethod
    def _attendance_summary(db: Session, company_id: int) -> Dict[str, Any]:
        this_month = datetime.now().replace(day=1).date()
        absent = db.query(func.count(Attendance.id)).join(Employee).filter(
            Employee.company_id == company_id,
            Attendance.status == "absent",
            Attendance.date >= this_month
        ).scalar() or 0
        present = db.query(func.count(Attendance.id)).join(Employee).filter(
            Employee.company_id == company_id,
            Attendance.status == "present",
            Attendance.date >= this_month
        ).scalar() or 0
        total = absent + present
        rate = round(present / total * 100, 1) if total > 0 else 0
        return {
            "answer": f"📊 **Attendance This Month:**\n- ✅ Present: {present} records\n- ❌ Absent: {absent} records\n- 📈 Attendance Rate: **{rate}%**",
            "data": {"present": present, "absent": absent, "rate": rate}, "type": "metric"
        }

    # ----- Performance -----

    @staticmethod
    def _performance_summary(db: Session, company_id: int) -> Dict[str, Any]:
        avg_rating = db.query(func.avg(FeedbackReview.rating)).filter(
            FeedbackReview.company_id == company_id
        ).scalar()
        total_reviews = db.query(func.count(FeedbackReview.id)).filter(
            FeedbackReview.company_id == company_id
        ).scalar()
        active_okrs = db.query(func.count(OKRGoal.id)).filter(
            OKRGoal.company_id == company_id,
            OKRGoal.status.in_(["pending", "in_progress"])
        ).scalar()
        rating_str = f"{avg_rating:.1f}/5" if avg_rating else "N/A"
        return {
            "answer": f"🏆 **Performance Overview:**\n- ⭐ Avg Review Rating: **{rating_str}**\n- 📋 Total Reviews: **{total_reviews}**\n- 🎯 Active OKRs: **{active_okrs}**",
            "data": {"avg_rating": float(avg_rating) if avg_rating else 0, "total_reviews": total_reviews, "active_okrs": active_okrs},
            "type": "metric"
        }

    @staticmethod
    def _top_performers(db: Session, company_id: int) -> Dict[str, Any]:
        results = db.query(
            Employee.full_name,
            func.avg(FeedbackReview.rating).label("avg_rating")
        ).join(FeedbackReview, FeedbackReview.employee_id == Employee.id).filter(
            Employee.company_id == company_id,
            FeedbackReview.rating.isnot(None)
        ).group_by(Employee.id).order_by(func.avg(FeedbackReview.rating).desc()).limit(5).all()

        if not results:
            return {"answer": "📊 No performance reviews found yet.", "type": "insight"}

        lines = ["🌟 **Top Performers (by avg review rating):**\n"]
        data = []
        for i, r in enumerate(results, 1):
            stars = "⭐" * round(r.avg_rating)
            lines.append(f"{i}. **{r[0]}** — {r.avg_rating:.1f}/5 {stars}")
            data.append({"name": r[0], "rating": float(r.avg_rating)})

        return {"answer": "\n".join(lines), "data": data, "type": "chart"}

    # ----- Offer Letter Draft -----

    @staticmethod
    def _draft_offer_letter(db: Session, company_id: int, candidate_name: str) -> Dict[str, Any]:
        from app.models.company import Company
        company = db.query(Company).filter(Company.id == company_id).first()
        company_name = company.name if company else "Our Company"
        today = datetime.now().strftime("%B %d, %Y")
        letter = f"""---
**OFFER LETTER — {company_name}**

Date: {today}

Dear **{candidate_name.title()}**,

We are pleased to extend this offer of employment to you for the position of **[Designation]** at **{company_name}**.

**Compensation Package:**
- **CTC:** ₹[Amount] per annum
- **Fixed Component:** ₹[Amount] per month
- **Variable Component:** ₹[Amount] (performance-based)
- **Joining Bonus:** ₹[Amount] (if applicable)

**Key Terms:**
- **Joining Date:** [Date]
- **Location:** [City, State]
- **Probation Period:** 3 months
- **Working Hours:** 9:00 AM – 6:00 PM (Mon–Fri)
- **Leaves:** 18 days per annum

This offer is contingent upon successful verification of your documents and background check.

Please confirm your acceptance by [Response Deadline].

We look forward to welcoming you to our team!

Warm Regards,  
**HR Team | {company_name}**

---
_✍️ Generated by AutoPay-OS AI Copilot. Please customize bracketed fields before sending._
"""
        return {
            "answer": letter,
            "type": "draft",
            "document_type": "offer_letter",
            "candidate": candidate_name.title()
        }

    # ----- Team Health Report -----

    @staticmethod
    def _team_health_report(db: Session, company_id: int) -> Dict[str, Any]:
        headcount = db.query(func.count(Employee.id)).filter(
            Employee.company_id == company_id, Employee.is_active == True
        ).scalar() or 0

        pending_leaves = db.query(func.count(LeaveApplication.id)).join(Employee).filter(
            Employee.company_id == company_id, LeaveApplication.status == LeaveStatus.PENDING
        ).scalar() or 0

        avg_rating = db.query(func.avg(FeedbackReview.rating)).filter(
            FeedbackReview.company_id == company_id
        ).scalar()

        total_payroll = db.query(func.sum(AutoPayOSRecord.net_pay)).filter(
            AutoPayOSRecord.company_id == company_id,
            AutoPayOSRecord.status == AutoPayOSStatus.PAID
        ).scalar() or 0

        health_score = 70
        issues = []
        if pending_leaves > headcount * 0.3:
            health_score -= 15
            issues.append(f"⚠️ High pending leaves: {pending_leaves}")
        if avg_rating and avg_rating < 3:
            health_score -= 15
            issues.append(f"⚠️ Low avg performance rating: {avg_rating:.1f}/5")
        if not issues:
            issues.append("✅ No critical issues detected")

        status_emoji = "🟢" if health_score >= 70 else "🟡" if health_score >= 50 else "🔴"

        report = f"""🏢 **Workforce Health Report**

{status_emoji} **Overall Health Score: {health_score}/100**

📊 **Key Metrics:**
- 👥 Active Employees: **{headcount}**
- 💰 Total Payroll Disbursed: **₹{float(total_payroll):,.2f}**
- ⭐ Avg Performance Rating: **{f'{float(avg_rating):.1f}/5' if avg_rating else 'N/A'}**
- 📋 Pending Leave Requests: **{pending_leaves}**

**Issues Detected:**
{chr(10).join(issues)}
"""
        return {
            "answer": report,
            "data": {"health_score": health_score, "headcount": headcount},
            "type": "report"
        }

    # ----- Hiring Recommendation -----

    @staticmethod
    def _hiring_recommendation(db: Session, company_id: int) -> Dict[str, Any]:
        headcount = db.query(func.count(Employee.id)).filter(
            Employee.company_id == company_id, Employee.is_active == True
        ).scalar() or 0

        dept_counts = db.query(
            Department.name, func.count(Employee.id).label("count")
        ).join(Employee, Employee.department_id == Department.id).filter(
            Department.company_id == company_id, Employee.is_active == True
        ).group_by(Department.name).all()

        lines = ["🔎 **Hiring Recommendation Analysis:**\n"]
        if not dept_counts:
            lines.append("Not enough data to make recommendations.")
        else:
            avg_size = headcount / len(dept_counts) if dept_counts else 0
            for dept, count in dept_counts:
                if count < avg_size * 0.6:
                    lines.append(f"- ⚠️ **{dept}** is understaffed ({count} people, avg {avg_size:.0f}) → Consider hiring")
                elif count > avg_size * 1.5:
                    lines.append(f"- ✅ **{dept}** is well-staffed ({count} people)")
                else:
                    lines.append(f"- 🟡 **{dept}**: {count} people (balanced)")

        return {
            "answer": "\n".join(lines),
            "data": [{"dept": d, "count": c} for d, c in dept_counts],
            "type": "insight"
        }

    # ----- Utils -----

    @staticmethod
    def _extract_dept(db: Session, company_id: int, text: str) -> Optional[str]:
        for dept in db.query(Department.name).filter(Department.company_id == company_id).all():
            if dept[0].lower() in text:
                return dept[0]
        return None
