from sqlalchemy.orm import Session
from datetime import date, datetime
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.services.ewa_service import EWAService

class WhatsAppService:
    @staticmethod
    def process_message(db: Session, phone_number: str, message_body: str) -> str:
        """
        Simulates processing a WhatsApp message.
        Commands:
        - BALANCE: Check EWA balance.
        - ATTENDANCE: Mark present for today.
        - PAYSLIP: Get latest payslip link.
        - HELP: Show commands.
        """
        # Normalize phone (remove +91, spaces) - In mock, use exact string or email lookup
        # For simulation, we might pass email/employee_id directly or just assume phone matches
        
        # Find employee by phone
        employee = db.query(Employee).filter(Employee.phone == phone_number).first()
        
        if not employee:
            return "🚫 Sorry, we couldn't identify your phone number in our records. Please contact HR."

        command = message_body.strip().upper()
        
        if "BALANCE" in command:
            balance_data = EWAService.calculate_available_balance(db, employee.id)
            return (f"💰 *EWA Balance Update*\n\n"
                    f"Earned: ₹{balance_data['earned']:.2f}\n"
                    f"Available to Withdraw: *₹{balance_data['available']:.2f}*\n\n"
                    f"Reply *WITHDRAW <Amount>* to request funds.")
                    
        elif "ATTENDANCE" in command:
            today = date.today()
            existing = db.query(Attendance).filter(
                Attendance.employee_id == employee.id,
                Attendance.date == today
            ).first()
            
            if existing:
                return f"✅ You are already marked *{existing.status.upper()}* for today ({today})."
            
            # Auto-mark present
            new_attendance = Attendance(
                employee_id=employee.id,
                date=today,
                status="present",
                check_in=datetime.now().time()
            )
            db.add(new_attendance)
            db.commit()
            return f"✅ Success! Marked *PRESENT* for today ({today}) at {datetime.now().strftime('%H:%M')}."

        elif "PAYSLIP" in command:
            # Mock link
            return (f"📄 *Payslip Generated*\n\n"
                    f"Here is your payslip for the last month:\n"
                    f"https://payroll.krg.com/doc/{employee.employee_code}/last-payslip.pdf\n\n"
                    f"(Password: Your PAN DOY)")

        elif "WITHDRAW" in command:
             # Parse amount
             try:
                 parts = command.split()
                 if len(parts) < 2:
                     return "⚠️ Invalid format. Reply *WITHDRAW 500*"
                 
                 amount = float(parts[1])
                 # Call EWA request (simplified without company_id param for internal service if needed, 
                 # but service needs it. Let's fetch company from emp)
                 EWAService.request_withdrawal(db, employee.id, employee.company_id, amount)
                 return f"✅ Request for *₹{amount}* submitted for approval."
             except Exception as e:
                 return f"❌ Failed: {str(e)}"

        else:
            return ("🤖 *AutoPayOS Bot Help*\n\n"
                    "I can help you with:\n"
                    "- *BALANCE*: Check earned wage access\n"
                    "- *ATTENDANCE*: Mark usage for today\n"
                    "- *PAYSLIP*: Download latest slip\n"
                    "- *WITHDRAW <Amount>*: Request early salary")
