from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from io import BytesIO
from datetime import date
from typing import Dict, Any, List

class PDFService:
    @staticmethod
    def generate_form_16(employee_name: str, pan: str, company_name: str, tan: str, year: str, data: Dict[str, Any]) -> BytesIO:
        """
        Simulates generation of TDS Certificate Part B (Form 16).
        """
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        # Header
        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(width/2, height - 1*inch, "FORM NO. 16")
        p.setFont("Helvetica", 10)
        p.drawCentredString(width/2, height - 1.25*inch, "[See rule 31(1)(a)]")
        p.drawCentredString(width/2, height - 1.5*inch, "Certificate under section 203 of the Income-tax Act, 1961 for tax deducted at source on salary")
        
        # Table Borders
        p.rect(0.5*inch, height - 7.5*inch, width - 1*inch, 5.5*inch)
        
        # Company/Employee Details
        p.setFont("Helvetica-Bold", 10)
        p.drawString(0.7*inch, height - 2.2*inch, "Name and Address of the Employer:")
        p.setFont("Helvetica", 10)
        p.drawString(0.7*inch, height - 2.4*inch, company_name)
        p.drawString(0.7*inch, height - 2.6*inch, "TAN: " + tan)
        
        p.setFont("Helvetica-Bold", 10)
        p.drawString(width/2 + 0.2*inch, height - 2.2*inch, "Name and Address of the Employee:")
        p.setFont("Helvetica", 10)
        p.drawString(width/2 + 0.2*inch, height - 2.4*inch, employee_name)
        p.drawString(width/2 + 0.2*inch, height - 2.6*inch, "PAN: " + pan)
        
        # Salary Details Title
        p.setFont("Helvetica-Bold", 12)
        p.drawString(0.7*inch, height - 3.2*inch, "Summary of Salary Paid and Tax Deducted")
        
        # Table Mockup
        p.line(0.5*inch, height - 3.4*inch, width - 0.5*inch, height - 3.4*inch)
        cols = ["Item", "Amount (Rs.)"]
        p.drawString(0.7*inch, height - 3.6*inch, cols[0])
        p.drawString(width - 2*inch, height - 3.6*inch, cols[1])
        p.line(0.5*inch, height - 3.7*inch, width - 0.5*inch, height - 3.7*inch)
        
        items = [
            ("Gross Salary", data.get("gross", "0.00")),
            ("Standard Deduction", "50,000.00"),
            ("Taxable Income", data.get("taxable", "0.00")),
            ("Total Tax Payable", data.get("tax", "0.00")),
            ("Tax Deducted and Deposited", data.get("tax", "0.00")),
        ]
        
        y = height - 4.0*inch
        for item, val in items:
            p.drawString(0.7*inch, y, item)
            p.drawString(width - 2*inch, y, val)
            y -= 0.3*inch
            
        # Footer
        p.setFont("Helvetica-Oblique", 8)
        p.drawString(0.7*inch, 1*inch, f"Generated automatically by AI Payroll Engine on {date.today().strftime('%Y-%m-%d')}")
        p.drawString(0.7*inch, 0.8*inch, "This is a computer generated certificate and does not require a physical signature.")
        
        p.showPage()
        p.save()
        buffer.seek(0)
        return buffer

    @staticmethod
    def generate_form_24q(company_name: str, records: List[Dict[str, Any]]) -> BytesIO:
        """
        Simulates generation of Form 24Q (Quarterly Statement of TDS).
        """
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4
        
        p.setFont("Helvetica-Bold", 14)
        p.drawCentredString(width/2, height - 1*inch, "Form No. 24Q")
        p.setFont("Helvetica", 10)
        p.drawCentredString(width/2, height - 1.2*inch, "Quarterly statement of deduction of tax under section 192")
        
        p.drawString(1*inch, height - 2*inch, f"Employer: {company_name}")
        p.drawString(1*inch, height - 2.2*inch, f"Financial Year: 2025-26")
        
        # Simple data list
        y = height - 3*inch
        p.setFont("Helvetica-Bold", 10)
        p.drawString(1*inch, y, "Employee Name")
        p.drawString(3*inch, y, "PAN")
        p.drawString(5*inch, y, "TDS Deposited")
        p.line(1*inch, y-0.1*inch, width-1*inch, y-0.1*inch)
        
        p.setFont("Helvetica", 10)
        y -= 0.4*inch
        for rec in records:
            p.drawString(1*inch, y, rec['name'])
            p.drawString(3*inch, y, rec['pan'])
            p.drawString(5*inch, y, f"Rs. {rec['tds']}")
            y -= 0.3*inch
            if y < 1*inch:
                p.showPage()
                y = height - 1*inch
                
        p.showPage()
        p.save()
        buffer.seek(0)
        return buffer
