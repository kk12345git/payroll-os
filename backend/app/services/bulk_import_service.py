import pandas as pd
import io
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.employee import Employee, Gender, MaritalStatus
from app.models.company import Company
from app.models.payroll import SalaryStructure
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

class BulkImportService:
    @staticmethod
    def process_employee_excel(file_content: bytes, company_id: int, db: Session) -> Dict[str, Any]:
        """
        Processes an Excel file containing employee data and imports them into the database.
        """
        try:
            df = pd.read_excel(io.BytesIO(file_content))
            
            # Required columns validation
            required_cols = ['employee_code', 'full_name', 'email', 'date_of_joining', 'designation', 'basic_salary']
            missing = [col for col in required_cols if col not in df.columns]
            if missing:
                return {"success": False, "error": f"Missing required columns: {', '.join(missing)}"}

            imported_count = 0
            errors = []

            for index, row in df.iterrows():
                try:
                    # Check if employee already exists in this company
                    existing = db.query(Employee).filter(
                        Employee.employee_code == str(row['employee_code']),
                        Employee.company_id == company_id
                    ).first()
                    
                    if existing:
                        errors.append(f"Row {index+2}: Employee code {row['employee_code']} already exists.")
                        continue

                    # Create Employee
                    employee = Employee(
                        company_id=company_id,
                        employee_code=str(row['employee_code']),
                        full_name=row['full_name'],
                        email=row['email'],
                        phone=str(row.get('phone', '')),
                        designation=row['designation'],
                        date_of_joining=pd.to_datetime(row['date_of_joining']).date(),
                        gender=Gender(row.get('gender', 'male').lower()),
                        marital_status=MaritalStatus(row.get('marital_status', 'single').lower()),
                        is_active=True
                    )
                    
                    db.add(employee)
                    db.flush() # Get the ID

                    # Create default Salary Structure
                    # Simple rule: HRA 50%, Special Allowance remainder if provided
                    basic = Decimal(str(row['basic_salary']))
                    hra = basic * Decimal("0.5")
                    
                    salary = SalaryStructure(
                        employee_id=employee.id,
                        basic=basic,
                        hra=hra,
                        conveyance=Decimal("1600"), # Standard Default
                        medical_allowance=Decimal("1250"), # Standard Default
                        special_allowance=Decimal(str(row.get('special_allowance', 0))),
                        pf_enabled=True,
                        esi_enabled=True,
                        pt_enabled=True,
                        tds_enabled=True
                    )
                    db.add(salary)
                    imported_count += 1

                except Exception as e:
                    logger.error(f"Error importing row {index+2}: {str(e)}")
                    errors.append(f"Row {index+2}: {str(e)}")

            db.commit()
            return {
                "success": True, 
                "imported_count": imported_count,
                "errors": errors
            }

        except Exception as e:
            logger.error(f"Bulk import failed: {str(e)}")
            return {"success": False, "error": f"Failed to parse Excel file: {str(e)}"}
