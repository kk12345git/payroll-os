from typing import Dict

class CurrencyService:
    SYMBOLS = {
        "INR": "₹",
        "USD": "$",
        "AED": "د.إ",
        "GBP": "£",
        "EUR": "€"
    }
    
    # Mock exchange rates (Base: INR)
    RATES = {
        "INR": 1.0,
        "USD": 0.012,
        "AED": 0.044,
    }

    @staticmethod
    def get_symbol(currency_code: str) -> str:
        return CurrencyService.SYMBOLS.get(currency_code.upper(), "₹")

    @staticmethod
    def convert(amount: float, from_curr: str, to_curr: str) -> float:
        if from_curr == to_curr:
            return amount
        
        # Convert to INR first (if not already)
        inr_amount = amount / CurrencyService.RATES.get(from_curr, 1.0)
        # Convert to target
        return inr_amount * CurrencyService.RATES.get(to_curr, 1.0)
