from decimal import Decimal
from typing import Dict, List, Any
from app.models.employee import Employee
from app.models.payroll import SalaryStructure

class TaxOptimizerService:
    @staticmethod
    def calculate_tax(taxable_income: Decimal, regime: str = "new", age: int = 30) -> Decimal:
        """
        Simplified Indian Income Tax Calculation (FY 2024-25).
        Note: This is an estimation for simulation purposes.
        """
        tax = Decimal(0)
        income = taxable_income
        
        if regime == "new":
            # New Regime Slabs (FY 24-25 Budget Update)
            # 0-3L: Nil
            # 3-7L: 5%
            # 7-10L: 10%
            # 10-12L: 15%
            # 12-15L: 20%
            # >15L: 30%
            if income <= 300000:
                return Decimal(0)
            elif income <= 700000:
                tax = (income - 300000) * Decimal("0.05")
            elif income <= 1000000:
                tax = (400000 * Decimal("0.05")) + \
                      (income - 700000) * Decimal("0.10")
            elif income <= 1200000:
                tax = (400000 * Decimal("0.05")) + \
                      (300000 * Decimal("0.10")) + \
                      (income - 1000000) * Decimal("0.15")
            elif income <= 1500000:
                tax = (400000 * Decimal("0.05")) + \
                      (300000 * Decimal("0.10")) + \
                      (200000 * Decimal("0.15")) + \
                      (income - 1200000) * Decimal("0.20")
            else:
                tax = (400000 * Decimal("0.05")) + \
                      (300000 * Decimal("0.10")) + \
                      (200000 * Decimal("0.15")) + \
                      (300000 * Decimal("0.20")) + \
                      (income - 1500000) * Decimal("0.30")
                      
            # Rebate u/s 87A (New Regime): Fully exempt if income <= 7L
            if income <= 700000:
                tax = Decimal(0)

        else:
            # Old Regime Slabs (FY 24-25 - No major changes)
            # 0-2.5L: Nil
            # 2.5-5L: 5%
            # 5-10L: 20%
            # >10L: 30%
            limit = 300000 if age >= 60 else 250000
            
            if income <= limit:
                return Decimal(0)
            elif income <= 500000:
                tax = (income - limit) * Decimal("0.05")
            elif income <= 1000000:
                tax = ((Decimal(500000) - Decimal(limit)) * Decimal("0.05")) + \
                      (income - 500000) * Decimal("0.20")
            else:
                tax = ((Decimal(500000) - Decimal(limit)) * Decimal("0.05")) + \
                      (Decimal(500000) * Decimal("0.20")) + \
                      (income - 1000000) * Decimal("0.30")

            # Rebate u/s 87A (Old Regime): Fully exempt if income <= 5L
            if income <= 500000:
                tax = Decimal(0)
                
        # Cess 4%
        cess = tax * Decimal("0.04")
        return tax + cess

    @staticmethod
    def optimize_tax(structure: SalaryStructure, current_regime: str = "new") -> Dict[str, Any]:
        """
        Analyzes the salary structure and suggests optimizations based on FY 2024-25.
        """
        gross_annual = (structure.basic + structure.hra + structure.special_allowance + 
                        structure.conveyance + structure.medical_allowance) * 12
        
        # Standard Deduction (FY 24-25 Budget Update)
        std_deduction_new = Decimal(75000)
        std_deduction_old = Decimal(50000)
        
        # 1. Calculate Current Liability
        std_ded = std_deduction_new if current_regime == "new" else std_deduction_old
        current_taxable = max(Decimal(0), gross_annual - std_ded)
        current_tax = TaxOptimizerService.calculate_tax(current_taxable, current_regime)
        
        suggestions = []
        
        # Scenario A: Old Regime Optimized
        # 80C: 1.5L, 80D: 25k, Std Ded: 50k
        old_regime_optimized_deductions = Decimal(150000) + Decimal(25000) + std_deduction_old
        hra_annual = structure.hra * 12
        old_regime_optimized_deductions += hra_annual
        
        taxable_old_optimized = max(Decimal(0), gross_annual - old_regime_optimized_deductions)
        tax_old_optimized = TaxOptimizerService.calculate_tax(taxable_old_optimized, "old")
        
        # Scenario B: New Regime
        taxable_new = max(Decimal(0), gross_annual - std_deduction_new)
        tax_new = TaxOptimizerService.calculate_tax(taxable_new, "new")
        
        # Comparison
        best_regime = "new" if tax_new < tax_old_optimized else "old"
        min_tax = min(tax_new, tax_old_optimized)
        
        if tax_old_optimized < current_tax and current_regime == "new":
             diff = current_tax - tax_old_optimized
             suggestions.append({
                 "category": "Regime Switch",
                 "title": "Consider switching to Old Regime",
                 "description": f"With deductions of ₹{float(old_regime_optimized_deductions):,.0f}, Old Regime saves more.",
                 "potential_saving": float(diff)
             })
             
        if current_regime == "old":
             # Specific 80C suggestions
             diff_80c = TaxOptimizerService.calculate_tax(current_taxable, "old") - \
                        TaxOptimizerService.calculate_tax(current_taxable - 150000, "old")
             if diff_80c > 0:
                suggestions.append({
                    "category": "80C Investment",
                    "title": "Maximize Section 80C",
                    "description": "Invest ₹1.5L in ELSS, PPF, or LIC to reduce taxable income.",
                    "potential_saving": float(diff_80c)
                })
             
        return {
            "current_tax": float(current_tax),
            "optimized_tax": float(min_tax),
            "potential_annual_savings": float(current_tax - min_tax),
            "recommended_regime": best_regime,
            "suggestions": suggestions,
            "simulations": {
                "old_regime_max_deductions": float(tax_old_optimized),
                "new_regime_standard": float(tax_new)
            }
        }
    @staticmethod
    def get_monthly_suggestion() -> Dict[str, str]:
        """
        Returns a rotating 'Tax Suggestion of the Month' based on the fiscal calendar.
        """
        month = datetime.now().month
        suggestions = {
            4: {"title": "Start of FY Planning", "tip": "Plan your 80C investments now to avoid last-minute stress in March!"},
            6: {"title": "LTA Claims", "tip": "Planning a summer vacation? Check your LTA eligibility for tax-free travel reimbursements."},
            9: {"title": "Advance Tax", "tip": "Ensure your advance tax installments are paid to avoid interest penalties."},
            12: {"title": "Investment Proofs", "tip": "Payroll will soon ask for investment proofs. Organize your receipts now!"},
            3: {"title": "Last Call for Savings", "tip": "March 31st is the deadline for tax-saving investments. Max out your 80C/80D now!"}
        }
        return suggestions.get(month, {"title": "Tax Efficiency", "tip": "Review your salary components to ensure you're maximizing HRA and standard deductions."})
