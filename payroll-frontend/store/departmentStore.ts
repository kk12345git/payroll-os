import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Department } from '../lib/mockData';

interface DepartmentStore {
    departments: Department[];
    selectedDepartment: Department | null;

    // Actions
    setDepartments: (departments: Department[]) => void;
    addDepartment: (department: Department) => void;
    updateDepartment: (id: string, department: Partial<Department>) => void;
    deleteDepartment: (id: string) => void;
    setSelectedDepartment: (department: Department | null) => void;
    getDepartmentById: (id: string) => Department | undefined;
    updateEmployeeCount: (departmentName: string, delta: number) => void;
}

export const useDepartmentStore = create<DepartmentStore>()(
    persist(
        (set, get) => ({
            departments: [],
            selectedDepartment: null,

            setDepartments: (departments) => set({ departments }),

            addDepartment: (department) => set((state) => ({
                departments: [...state.departments, department],
            })),

            updateDepartment: (id, updatedDepartment) => set((state) => ({
                departments: state.departments.map((dept) =>
                    dept.id === id ? { ...dept, ...updatedDepartment } : dept
                ),
            })),

            deleteDepartment: (id) => set((state) => ({
                departments: state.departments.filter((dept) => dept.id !== id),
            })),

            setSelectedDepartment: (department) => set({ selectedDepartment: department }),

            getDepartmentById: (id) => {
                const { departments } = get();
                return departments.find((dept) => dept.id === id);
            },

            updateEmployeeCount: (departmentName, delta) => set((state) => ({
                departments: state.departments.map((dept) =>
                    dept.name === departmentName
                        ? { ...dept, employeeCount: dept.employeeCount + delta }
                        : dept
                ),
            })),
        }),
        {
            name: 'payroll-departments',
        }
    )
);
