// Comprehensive Mock Data for Payroll System

export interface Employee {
    id: string;
    employeeId: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    joiningDate: string;
    status: 'active' | 'inactive';
    salary: number;
    photo?: string;
    address?: string;
    emergencyContact?: string;
    bankAccount?: string;
    panNumber?: string;
    aadharNumber?: string;
}

export interface Department {
    id: string;
    name: string;
    headId?: string;
    employeeCount: number;
    budget: number;
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string;
    status: 'present' | 'absent' | 'half-day' | 'leave';
    checkIn?: string;
    checkOut?: string;
}

export interface LeaveApplication {
    id: string;
    employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    appliedOn: string;
}

export interface SalaryStructure {
    employeeId: string;
    basic: number;
    hra: number;
    specialAllowance: number;
    pf: number;
    esi: number;
    tax: number;
    professionalTax: number;
    grossSalary: number;
    netSalary: number;
}

// Generate Mock Employees
export const generateMockEmployees = (count: number = 100): Employee[] => {
    const departments = ['Engineering', 'Design', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];
    const designations = {
        Engineering: ['Software Engineer', 'Senior Engineer', 'Tech Lead', 'Engineering Manager'],
        Design: ['UI Designer', 'UX Designer', 'Product Designer', 'Design Lead'],
        HR: ['HR Executive', 'HR Manager', 'Talent Acquisition'],
        Finance: ['Accountant', 'Finance Manager', 'CFO'],
        Marketing: ['Marketing Executive', 'Marketing Manager', 'Content Writer'],
        Sales: ['Sales Executive', 'Sales Manager', 'Business Development'],
        Operations: ['Operations Executive', 'Operations Manager', 'Admin'],
    };

    const firstNames = ['Alexander', 'Sarah', 'Marcus', 'Emily', 'David', 'Sophia', 'James', 'Olivia', 'Raj', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anita'];
    const lastNames = ['Wright', 'Chen', 'Johnson', 'Patel', 'Kumar', 'Singh', 'Sharma', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson'];

    return Array.from({ length: count }, (_, i) => {
        const dept = departments[i % departments.length];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;

        return {
            id: `emp-${i + 1}`,
            employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
            name,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
            phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            department: dept,
            designation: designations[dept as keyof typeof designations][Math.floor(Math.random() * designations[dept as keyof typeof designations].length)],
            joiningDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            status: Math.random() > 0.05 ? 'active' : 'inactive',
            salary: Math.floor(Math.random() * 100000) + 30000,
            address: `${Math.floor(Math.random() * 500) + 1}, ${['MG Road', 'Park Street', 'Brigade Road', 'Indiranagar', 'Koramangala'][Math.floor(Math.random() * 5)]}, Bangalore`,
            emergencyContact: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            bankAccount: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
            panNumber: `${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}${['P', 'C', 'H'][Math.floor(Math.random() * 3)]}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}`,
            aadharNumber: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
        };
    });
};

// Generate Mock Departments
export const generateMockDepartments = (): Department[] => {
    return [
        { id: 'dept-1', name: 'Engineering', employeeCount: 45, budget: 5000000 },
        { id: 'dept-2', name: 'Design', employeeCount: 12, budget: 1200000 },
        { id: 'dept-3', name: 'HR', employeeCount: 8, budget: 800000 },
        { id: 'dept-4', name: 'Finance', employeeCount: 10, budget: 1000000 },
        { id: 'dept-5', name: 'Marketing', employeeCount: 15, budget: 1500000 },
        { id: 'dept-6', name: 'Sales', employeeCount: 25, budget: 2500000 },
        { id: 'dept-7', name: 'Operations', employeeCount: 10, budget: 1000000 },
    ];
};

// Generate Mock Attendance
export const generateMockAttendance = (employees: Employee[], months: number = 6): AttendanceRecord[] => {
    const records: AttendanceRecord[] = [];
    const today = new Date();

    employees.forEach(emp => {
        for (let monthOffset = 0; monthOffset < months; monthOffset++) {
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() - monthOffset + 1, 0).getDate();

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(today.getFullYear(), today.getMonth() - monthOffset, day);
                const dayOfWeek = date.getDay();

                // Skip weekends
                if (dayOfWeek === 0 || dayOfWeek === 6) continue;

                const random = Math.random();
                let status: 'present' | 'absent' | 'half-day' | 'leave';

                if (random < 0.85) status = 'present';
                else if (random < 0.90) status = 'leave';
                else if (random < 0.95) status = 'half-day';
                else status = 'absent';

                records.push({
                    id: `att-${emp.id}-${date.toISOString().split('T')[0]}`,
                    employeeId: emp.id,
                    date: date.toISOString().split('T')[0],
                    status,
                    checkIn: status === 'present' || status === 'half-day' ? `09:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : undefined,
                    checkOut: status === 'present' ? `18:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : undefined,
                });
            }
        }
    });

    return records;
};

// Generate Mock Leave Applications
export const generateMockLeaves = (employees: Employee[]): LeaveApplication[] => {
    const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave'];
    const statuses: ('pending' | 'approved' | 'rejected')[] = ['pending', 'approved', 'rejected'];

    return employees.flatMap((emp, idx) => {
        const numLeaves = Math.floor(Math.random() * 5) + 1;

        return Array.from({ length: numLeaves }, (_, i) => {
            const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const days = Math.floor(Math.random() * 5) + 1;
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + days);

            return {
                id: `leave-${idx}-${i}`,
                employeeId: emp.id,
                leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                days,
                reason: ['Medical emergency', 'Family function', 'Personal work', 'Vacation'][Math.floor(Math.random() * 4)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                appliedOn: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };
        });
    });
};

// Generate Salary Structures
export const generateSalaryStructures = (employees: Employee[]): SalaryStructure[] => {
    return employees.map(emp => {
        const basic = Math.floor(emp.salary * 0.4);
        const hra = Math.floor(basic * 0.5);
        const specialAllowance = emp.salary - basic - hra;

        const pfEmployee = Math.floor(basic * 0.12);
        const esiEmployee = emp.salary <= 21000 ? Math.floor(emp.salary * 0.0075) : 0;
        const tax = emp.salary > 50000 ? Math.floor(emp.salary * 0.1) : 0;
        const professionalTax = emp.salary > 15000 ? 200 : 0;

        const grossSalary = emp.salary;
        const netSalary = grossSalary - pfEmployee - esiEmployee - tax - professionalTax;

        return {
            employeeId: emp.id,
            basic,
            hra,
            specialAllowance,
            pf: pfEmployee,
            esi: esiEmployee,
            tax,
            professionalTax,
            grossSalary,
            netSalary,
        };
    });
};

// Initialize all mock data
export const initializeMockData = () => {
    const employees = generateMockEmployees(100);
    const departments = generateMockDepartments();
    const attendance = generateMockAttendance(employees, 6);
    const leaves = generateMockLeaves(employees);
    const salaryStructures = generateSalaryStructures(employees);

    return {
        employees,
        departments,
        attendance,
        leaves,
        salaryStructures,
    };
};
