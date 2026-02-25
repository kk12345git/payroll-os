import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, type Employee } from '../lib/api';

interface EmployeeStore {
    employees: Employee[];
    selectedEmployee: Employee | null;
    searchQuery: string;
    departmentFilter: string;
    statusFilter: string;

    loading: boolean;
    error: string | null;

    // Actions
    fetchEmployees: () => Promise<void>;
    setEmployees: (employees: Employee[]) => void;
    addEmployee: (employee: Employee) => void;
    updateEmployee: (id: number, employee: Partial<Employee>) => void;
    deleteEmployee: (id: number) => void;
    setSelectedEmployee: (employee: Employee | null) => void;
    setSearchQuery: (query: string) => void;
    setDepartmentFilter: (department: string) => void;
    setStatusFilter: (status: string) => void;
    getFilteredEmployees: () => Employee[];
}

export const useEmployeeStore = create<EmployeeStore>()(
    persist(
        (set, get) => ({
            employees: [],
            selectedEmployee: null,
            searchQuery: '',
            departmentFilter: 'all',
            statusFilter: 'all',
            loading: false,
            error: null,

            fetchEmployees: async () => {
                set({ loading: true, error: null });
                try {
                    const employees = await api.getEmployees();
                    set({ employees, loading: false });
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            setEmployees: (employees) => set({ employees }),

            addEmployee: (employee) => set((state) => ({
                employees: [...state.employees, employee],
            })),

            updateEmployee: (id, updatedEmployee) => set((state) => ({
                employees: state.employees.map((emp) =>
                    emp.id === id ? { ...emp, ...updatedEmployee } : emp
                ),
            })),

            deleteEmployee: (id) => set((state) => ({
                employees: state.employees.filter((emp) => emp.id !== id),
            })),

            setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),

            setSearchQuery: (query) => set({ searchQuery: query }),

            setDepartmentFilter: (department) => set({ departmentFilter: department }),

            setStatusFilter: (status) => set({ statusFilter: status }),

            getFilteredEmployees: () => {
                const { employees, searchQuery, departmentFilter, statusFilter } = get();

                return employees.filter((emp) => {
                    const fullName = emp.full_name || '';
                    const email = emp.email || '';
                    const search = searchQuery.toLowerCase();

                    const matchesSearch = fullName.toLowerCase().includes(search) ||
                        email.toLowerCase().includes(search);

                    const matchesDepartment = departmentFilter === 'all' || emp.department_id.toString() === departmentFilter;
                    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? emp.is_active : !emp.is_active);

                    return matchesSearch && matchesDepartment && matchesStatus;
                });
            },
        }),
        {
            name: 'autopay-os-employees',
            version: 2,
        }
    )
);
