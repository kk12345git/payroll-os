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
            # New Regime Slabs (FY 24-25)
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
                tax = (Decimal(400000) * Decimal("0.05")) + \
                      (income - 700000) * Decimal("0.10")
            elif income <= 1200000:
                tax = (Decimal(400000) * Decimal("0.05")) + \
                      (Decimal(300000) * Decimal("0.10")) + \
                      (income - 1000000) * Decimal("0.15")
            elif income <= 1500000:
                tax = (Decimal(400000) * Decimal("0.05")) + \
                      (Decimal(300000) * Decimal("0.10")) + \
                      (Decimal(200000) * Decimal("0.15")) + \
                      (income - 1200000) * Decimal("0.20")
            else:
                tax = (Decimal(400000) * Decimal("0.05")) + \
                      (Decimal(300000) * Decimal("0.10")) + \
                      (Decimal(200000) * Decimal("0.15")) + \
                      (Decimal(300000) * Decimal("0.20")) + \
                      (income - 1500000) * Decimal("0.30")
                      
            # Rebate u/s 87A for income up to 7L (New Regime)
            if income <= 700000:
                tax = Decimal(0)

        else:
            # Old Regime Slabs (Simplified)
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

            # Rebate u/s 87A for income up to 5L (Old Regime)
            if income <= 500000:
                tax = Decimal(0)
                
        # Cess 4%
        cess = tax * Decimal("0.04")
        return tax + cess

    @staticmethod
    def optimize_tax(structure: SalaryStructure, current_regime: str = "new") -> Dict[str, Any]:
        """
        Analyzes the salary structure and suggests optimizations.
        """
        gross_annual = (structure.basic + structure.hra + structure.special_allowance + 
                        structure.conveyance + structure.medical_allowance) * 12
        
        # Standard Deduction
        std_deduction = Decimal(50000) # For both regimes in FY24-25? Actually New Regime gets 75k in Interim Budget? 
        # Let's use 50k as standard conservative baseline or 75k if implemented. 
        # Let's stick to 50k for Old, 50k New (standard).
        
        # 1. Calculate Current Liability
        # Assuming no declarations for now (worst case)
        current_taxable = max(Decimal(0), gross_annual - std_deduction)
        current_tax = TaxOptimizerService.calculate_tax(current_taxable, current_regime)
        
        suggestions = []
        potential_savings = Decimal(0)
        
        # 2. Suggest 80C (Limit 1.5L) - Only for OLD REGIME usually, 
        # but comparisons are useful. Or user might shift to Old.
        
        # If New Regime is active, suggestions are limited essentially to switching or NPS (80CCD(2)).
        # Let's simulate switching to Old Regime with Max Deductions vs New Regime.
        
        # Scenario A: Old Regime Optimized
        # 80C: 1.5L
        # 80D: 25k (Self)
        # HRA: Fully Exempt (Simplified assumption for max simulation)
        # Standard Ded: 50k
        
        old_regime_optimized_deductions = Decimal(150000) + Decimal(25000) + Decimal(50000)
        # HRA Exemption estimate (lowest of Rent-10% Basic, 50% Basic, HRA received)
        # Let's estimate Max HRA exemption as actual HRA received for simulation
        hra_annual = structure.hra * 12
        old_regime_optimized_deductions += hra_annual
        
        taxable_old_optimized = max(Decimal(0), gross_annual - old_regime_optimized_deductions)
        tax_old_optimized = TaxOptimizerService.calculate_tax(taxable_old_optimized, "old")
        
        # Scenario B: New Regime
        # Standard Ded: 50k (or 75k proposed)
        taxable_new = max(Decimal(0), gross_annual - Decimal(50000))
        tax_new = TaxOptimizerService.calculate_tax(taxable_new, "new")
        
        # Comparison
        best_regime = "new" if tax_new < tax_old_optimized else "old"
        min_tax = min(tax_new, tax_old_optimized)
        
        if tax_old_optimized < current_tax:
             diff = current_tax - tax_old_optimized
             suggestions.append({
                 "category": "Regime Switch",
                 "title": "Consider switching to Old Regime",
                 "description": "With full 80C (₹1.5L) and HRA investments, Old Regime saves you money.",
                 "potential_saving": float(diff)
             })
             
        if current_regime == "old":
             # Specific 80C suggestions
             suggestions.append({
                 "category": "80C Investment",
                 "title": "Maximize Section 80C",
                 "description": "Invest ₹1.5L in ELSS, PPF, or LIC to reduce taxable income.",
                 "potential_saving": float(TaxOptimizerService.calculate_tax(current_taxable, "old") - 
                                            TaxOptimizerService.calculate_tax(current_taxable - 150000, "old"))
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
