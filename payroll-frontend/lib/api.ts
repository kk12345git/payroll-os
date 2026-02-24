const getApiBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // Smart Fallback for Production Deployment
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');

        if (!isLocal) {
            return 'https://payroll-api-production-f97d.up.railway.app';
        }
    }

    return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

interface LoginCredentials {
    username: string; // email
    password: string;
}

interface RegisterData {
    email: string;
    password: string;
    full_name: string;
    company_name: string;
    country?: string;
    base_currency?: string;
    role?: string;
}

interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Department Interfaces
interface Department {
    id: number;
    name: string;
    code: string | null;
    budget: number;
    manager_id: number | null;
    company_id: number;
    created_at: string;
    updated_at: string | null;
}

interface DepartmentCreate {
    name: string;
    code?: string;
    budget?: number;
    manager_id?: number;
    company_id: number;
}

// Employee Interfaces (aligned with backend)
interface Employee {
    id: number;
    full_name: string;
    email?: string;
    phone: string | null;
    gender: string | null;
    date_of_birth: string | null;
    date_of_joining: string;
    designation: string;
    department_id: number;
    company_id: number;
    employee_code: string | null;
    pan_number: string | null;
    aadhaar_number: string | null;
    uan_number: string | null;
    esi_number: string | null;
    bank_account_number: string | null;
    bank_ifsc_code: string | null;
    bank_name: string | null;
    tax_regime: string;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
}

// Attendance Interfaces
interface Attendance {
    id: number;
    employee_id: number;
    date: string; // YYYY-MM-DD
    check_in: string | null; // HH:MM:SS
    check_out: string | null;
    status: string;
    work_location: string;
    remarks: string | null;
    created_at: string;
    updated_at: string | null;
}

interface AttendanceCreate {
    employee_id: number;
    date: string;
    check_in?: string;
    check_out?: string;
    status?: string;
    work_location?: string;
    remarks?: string;
}

export interface AttendanceRecord {
    id: number;
    employee_id: number;
    date: string;
    check_in?: string;
    check_out?: string;
    status: 'present' | 'absent' | 'half-day' | 'leave';
    work_location: string;
}

// Leave Interfaces
interface LeaveType {
    id: number;
    name: string;
    code: string;
    description: string | null;
    is_paid: boolean;
    annual_limit: number;
}

interface LeaveApplication {
    id: number;
    employee_id: number;
    leave_type_id: number;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
    approved_by_id: number | null;
    created_at: string;
    updated_at: string | null;
}

interface LeaveApplicationCreate {
    employee_id: number;
    leave_type_id: number;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
}

// Payroll Interfaces
export interface SalaryStructure {
    id: number;
    employee_id: number;
    basic: number;
    hra: number;
    conveyance: number;
    medical_allowance: number;
    special_allowance: number;
    pf_enabled: boolean;
    esi_enabled: boolean;
    pt_enabled: boolean;
    tds_enabled: boolean;
    created_at: string;
    updated_at: string | null;
}

export interface SalaryStructureCreate {
    employee_id: number;
    basic: number;
    hra: number;
    conveyance?: number;
    medical_allowance?: number;
    special_allowance?: number;
    pf_enabled?: boolean;
    esi_enabled?: boolean;
    pt_enabled?: boolean;
    tds_enabled?: boolean;
}

export interface SalaryStructureUpdate {
    basic?: number;
    hra?: number;
    conveyance?: number;
    medical_allowance?: number;
    special_allowance?: number;
    pf_enabled?: boolean;
    esi_enabled?: boolean;
    pt_enabled?: boolean;
    tds_enabled?: boolean;
}

export interface PayrollRecord {
    id: number;
    employee_id: number;
    month: number;
    year: number;
    paid_days: number;
    absent_days: number;
    gross_earnings: number;
    total_deductions: number;
    net_pay: number;
    status: 'draft' | 'processed' | 'paid' | 'cancelled';
    basic_earned: number | null;
    hra_earned: number | null;
    conveyance_earned: number | null;
    medical_earned: number | null;
    special_earned: number | null;
    pf_deduction: number | null;
    esi_deduction: number | null;
    pt_deduction: number | null;
    income_tax_deduction: number | null;
    processed_at: string | null;
    paid_at: string | null;
    created_at: string;
}

export interface PayrollProcessRequest {
    employee_ids: number[];
    month: number;
    year: number;
}

export interface PayrollSummary {
    month: number;
    year: number;
    total_gross: number;
    total_net: number;
    employee_count: number;
    status: string;
}

export interface Subscription {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'trial' | 'expired';
    expiry?: string;
}

export interface Anomaly {
    id: number;
    type: 'salary_spike' | 'compliance_mismatch' | 'ghost_employee' | 'tax_anomaly' | 'deduction_error';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description?: string;
    data?: any;
    is_resolved: boolean;
    created_at: string;
}

export interface EWABalance {
    earned: number;
    withdrawn: number;
    available: number;
    paid_days: number;
    daily_rate: number;
}

export interface EWAWithdrawal {
    id: number;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'settled';
    requested_at: string;
    notes?: string;
}

export interface TaxSuggestion {
    category: string;
    title: string;
    description: string;
    potential_saving: number;
}

export interface TaxOptimizationResponse {
    current_tax: number;
    optimized_tax: number;
    potential_annual_savings: number;
    recommended_regime: 'old' | 'new';
    suggestions: TaxSuggestion[];
    simulations: {
        old_regime_max_deductions: number;
        new_regime_standard: number;
    };
}

export interface CopilotResponse {
    answer: string;
    data?: any;
    type: 'metric' | 'entity' | 'chart' | 'error';
}

export interface ForecastData {
    historical: { year: number; month: number; amount: number }[];
    projections: { year: number; month: number; amount: number; confidence: number }[];
    metrics: {
        avg_monthly_liability: number;
        projected_6m_total: number;
        growth_projection_applied: string;
    };
}

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('access_token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                let error;
                try {
                    error = JSON.parse(errorText);
                } catch {
                    error = { detail: errorText };
                }

                console.error(`[ApiClient] Request to ${endpoint} failed with status ${response.status}:`, error);

                let errorMessage = 'Request failed';
                if (typeof error.detail === 'string') {
                    errorMessage = error.detail;
                } else if (error.detail && typeof error.detail === 'object') {
                    errorMessage = JSON.stringify(error.detail);
                } else if (error.message) {
                    errorMessage = error.message;
                }
                throw new Error(errorMessage || `HTTP ${response.status}`);
            }

            if (response.status === 204) {
                return {} as T;
            }

            return response.json();
        } catch (error) {
            console.error(`[ApiClient] Fetch error for ${endpoint}:`, error);
            throw error;
        }
    }

    // Auth endpoints
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await fetch(`${this.baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Login failed' }));
            throw new Error(error.detail || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        this.setToken(data.access_token);
        return data;
    }

    async register(userData: RegisterData): Promise<User> {
        return this.request<User>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async getCurrentUser(): Promise<User> {
        return this.request<User>('/api/auth/me');
    }

    // Employee endpoints
    async getEmployees(): Promise<Employee[]> {
        return this.request<Employee[]>('/api/employees');
    }

    async getEmployee(id: number): Promise<Employee> {
        return this.request<Employee>(`/api/employees/${id}`);
    }

    async createEmployee(data: Partial<Employee>): Promise<Employee> {
        return this.request<Employee>('/api/employees', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
        return this.request<Employee>(`/api/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteEmployee(id: number): Promise<void> {
        return this.request<void>(`/api/employees/${id}`, {
            method: 'DELETE',
        });
    }

    // Department endpoints
    async getDepartments(): Promise<Department[]> {
        return this.request<Department[]>('/api/departments');
    }

    async getDepartment(id: number): Promise<Department> {
        return this.request<Department>(`/api/departments/${id}`);
    }

    async createDepartment(data: DepartmentCreate): Promise<Department> {
        return this.request<Department>('/api/departments', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateDepartment(id: number, data: Partial<DepartmentCreate>): Promise<Department> {
        return this.request<Department>(`/api/departments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteDepartment(id: number): Promise<void> {
        return this.request<void>(`/api/departments/${id}`, {
            method: 'DELETE',
        });
    }

    // Attendance endpoints
    async getAttendance(params?: { start_date?: string; end_date?: string; employee_id?: number }): Promise<Attendance[]> {
        const queryParams = new URLSearchParams();
        if (params?.start_date) queryParams.append('start_date', params.start_date);
        if (params?.end_date) queryParams.append('end_date', params.end_date);
        if (params?.employee_id) queryParams.append('employee_id', params.employee_id.toString());

        const queryString = queryParams.toString();
        return this.request<Attendance[]>(`/api/attendance/${queryString ? `?${queryString}` : ''}`);
    }

    async markAttendance(data: AttendanceCreate): Promise<Attendance> {
        return this.request<Attendance>('/api/attendance/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Leave endpoints
    async getLeaveTypes(): Promise<LeaveType[]> {
        return this.request<LeaveType[]>('/api/leaves/types');
    }

    async getLeaves(): Promise<LeaveApplication[]> {
        return this.request<LeaveApplication[]>('/api/leaves');
    }

    async applyLeave(data: LeaveApplicationCreate): Promise<LeaveApplication> {
        return this.request<LeaveApplication>('/api/leaves', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async approveLeave(id: number): Promise<LeaveApplication> {
        return this.request<LeaveApplication>(`/api/leaves/${id}/approve`, {
            method: 'PUT',
        });
    }

    async rejectLeave(id: number, reason: string): Promise<LeaveApplication> {
        return this.request<LeaveApplication>(`/api/leaves/${id}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ rejection_reason: reason }),
        });
    }

    // Payroll endpoints
    async getSalaryStructure(employeeId: number): Promise<SalaryStructure> {
        return this.request<SalaryStructure>(`/api/payroll/salary-structures/${employeeId}`);
    }

    async createSalaryStructure(data: SalaryStructureCreate): Promise<SalaryStructure> {
        return this.request<SalaryStructure>('/api/payroll/salary-structures', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateSalaryStructure(employeeId: number, data: SalaryStructureUpdate): Promise<SalaryStructure> {
        return this.request<SalaryStructure>(`/api/payroll/salary-structures/${employeeId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async processPayroll(data: PayrollProcessRequest): Promise<PayrollRecord[]> {
        return this.request<PayrollRecord[]>('/api/payroll/process', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getPayrollSummaries(): Promise<PayrollSummary[]> {
        return this.request<PayrollSummary[]>('/api/payroll/summaries');
    }

    async getPayrollHistory(employeeId: number): Promise<PayrollRecord[]> {
        return this.request<PayrollRecord[]>(`/api/payroll/history/${employeeId}`);
    }

    // Subscription endpoints
    async getSubscription(): Promise<Subscription> {
        return this.request<Subscription>('/api/companies/subscription');
    }

    async upgradePlan(plan: string): Promise<Subscription> {
        return this.request<Subscription>('/api/companies/subscription/upgrade', {
            method: 'POST',
            body: JSON.stringify({ plan }),
        });
    }

    // Anomaly Detection endpoints
    async getAnomalies(resolved?: boolean): Promise<Anomaly[]> {
        const query = resolved !== undefined ? `?resolved=${resolved}` : '';
        return this.request<Anomaly[]>(`/api/anomalies/${query}`);
    }

    async resolveAnomaly(id: number, notes: string): Promise<{ status: string }> {
        return this.request<{ status: string }>(`/api/anomalies/${id}/resolve`, {
            method: 'PUT',
            body: JSON.stringify({ notes }),
        });
    }

    // EWA (Earned Wage Access) endpoints
    async getEWABalance(): Promise<EWABalance> {
        return this.request<EWABalance>('/api/ewa/balance');
    }

    async requestEWA(amount: number, notes?: string): Promise<EWAWithdrawal> {
        return this.request<EWAWithdrawal>('/api/ewa/request', {
            method: 'POST',
            body: JSON.stringify({ amount, notes }),
        });
    }

    async getEWAHistory(): Promise<EWAWithdrawal[]> {
        return this.request<EWAWithdrawal[]>('/api/ewa/history');
    }

    async getPendingEWA(): Promise<EWAWithdrawal[]> {
        return this.request<EWAWithdrawal[]>('/api/ewa/pending');
    }

    async processEWA(id: number, action: 'approve' | 'reject'): Promise<{ status: string }> {
        return this.request<{ status: string }>(`/api/ewa/${id}/action?action=${action}`, {
            method: 'POST'
        });
    }

    // Tax Optimizer
    async analyzeTax(regime: 'old' | 'new'): Promise<TaxOptimizationResponse> {
        return this.request<TaxOptimizationResponse>(`/api/tax-optimizer/analyze?current_regime=${regime}`);
    }

    // WhatsApp Simulation
    async simulateWhatsApp(phone: string, message: string): Promise<{ response: string }> {
        return this.request<{ response: string }>('/api/integrations/whatsapp/webhook', {
            method: 'POST',
            body: JSON.stringify({ phone, message }),
        });
    }

    // AI Copilot
    async askCopilot(query: string): Promise<CopilotResponse> {
        return this.request<CopilotResponse>('/api/copilot/query', {
            method: 'POST',
            body: JSON.stringify({ query }),
        });
    }

    // Analytics & AI
    async getForecast(months: number = 6): Promise<ForecastData> {
        return this.request<ForecastData>(`/api/analytics/forecast?months=${months}`);
    }

    // Company Settings
    async updateCompanySettings(data: { country?: string; base_currency?: string }): Promise<{ status: string; base_currency: string }> {
        return this.request<{ status: string; base_currency: string }>('/api/companies/settings', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // Billing
    async createCheckoutSession(plan: string): Promise<{ url: string; id: string }> {
        return this.request<{ url: string; id: string }>(`/api/billing/checkout-session?plan=${plan}`, {
            method: 'POST'
        });
    }

    async getBillingStatus(): Promise<{ plan: string; status: string; expiry: string }> {
        return this.request<{ plan: string; status: string; expiry: string }>('/api/billing/status');
    }

    // Internal Sales Admin
    async getAdminMetrics(): Promise<any> {
        return this.request<any>('/api/admin/metrics');
    }

    async getAllCompanies(): Promise<any[]> {
        return this.request<any[]>('/api/admin/companies');
    }

    // Staff Invitations
    async generateInviteLink(email: string): Promise<{ invite_url: string }> {
        return this.request<{ invite_url: string }>(`/api/invites/generate-link?email=${email}`, {
            method: 'POST'
        });
    }

    async getPendingInvites(): Promise<any[]> {
        return this.request<any[]>('/api/invites/pending');
    }
}

export const api = new ApiClient(API_BASE_URL);
export type {
    User, AuthResponse, LoginCredentials, RegisterData,
    Employee, Department, DepartmentCreate,
    Attendance, AttendanceCreate,
    LeaveType, LeaveApplication, LeaveApplicationCreate
};
