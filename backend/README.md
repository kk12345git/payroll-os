# AutoPay-OS Management System - Backend

## Backend server is running! 🚀

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Base URL**: http://localhost:8000

### Available Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user info

#### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/{id}` - Get employee by ID
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Soft delete employee

### Database
- Using SQLite: `payroll.db`
- Auto-created on first request
- Tables: users, companies, departments, employees

### Test the API
Open http://localhost:8000/docs in your browser to test the API interactively.

### Next Steps
1. Create a test user
2. Build frontend login page
3. Connect frontend to backend
4. Add more features (attendance, payroll, compliance)
