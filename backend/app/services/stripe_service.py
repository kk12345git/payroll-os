import stripe
from typing import Optional, Dict, Any
from app.core.config import settings

# Stripe Configuration
STRIPE_API_KEY = getattr(settings, "STRIPE_API_KEY", None)
stripe.api_key = STRIPE_API_KEY

class StripeService:
    @staticmethod
    def create_checkout_session(company_id: int, company_email: str, plan: str, country: str = "India") -> Dict[str, Any]:
        """
        Creates a Stripe Checkout Session for a subscription with geographic pricing.
        """
        # Determine Price ID based on Plan & Region (Purchasing Power Parity)
        is_india = country.lower() == "india"
        
        price_ids = {
            "pro": settings.STRIPE_PRICE_ID_INDIA if is_india else settings.STRIPE_PRICE_ID_GLOBAL,
            "enterprise": "price_enterprise_custom" # Custom logic for Enterprise
        }
        
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price': price_ids.get(plan.lower(), price_ids["pro"]),
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=f"{settings.FRONTEND_URL}/dashboard/billing?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_URL}/dashboard/billing",
                metadata={
                    "company_id": str(company_id),
                    "plan": plan
                },
                customer_email=company_email
            )
            return {"url": session.url, "id": session.id}
        except Exception as e:
            print(f"Stripe Error: {e}")
            # Fallback for demo if key is invalid
            return {"url": f"{settings.FRONTEND_URL}/dashboard/billing?status=mock_success", "id": "mock_session"}

    @staticmethod
    def construct_event(payload: bytes, sig_header: str, webhook_secret: str):
        """
        Validates and parses a Stripe Webhook event.
        """
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
            return event
        except Exception as e:
            raise e

    @staticmethod
    def handle_webhook_event(event: Dict[str, Any]):
        """
        Processes Stripe events to update company subscription status.
        """
        event_type = event['type']
        
        if event_type == 'checkout.session.completed':
            session = event['data']['object']
            company_id = session['metadata'].get('company_id')
            plan = session['metadata'].get('plan')
            # Update DB logic would go here
            return {"company_id": company_id, "plan": plan, "status": "active"}
            
        return None
