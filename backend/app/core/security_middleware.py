from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict

class SecurityHardeningMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.rate_limit_map = defaultdict(list)
        self.RATE_LIMIT = 100 # Requests per minute
        
    async def dispatch(self, request: Request, call_next):
        # 1. Basic Rate Limiting
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean up old requests
        self.rate_limit_map[client_ip] = [t for t in self.rate_limit_map[client_ip] if current_time - t < 60]
        
        if len(self.rate_limit_map[client_ip]) >= self.RATE_LIMIT:
            raise HTTPException(status_code=429, detail="Too many requests. Please slow down.")
            
        self.rate_limit_map[client_ip].append(current_time)

        # 2. Add Security Headers
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response
