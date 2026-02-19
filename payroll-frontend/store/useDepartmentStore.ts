import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, type Department, type DepartmentCreate } from '../lib/api';

interface DepartmentStore {
    departments: Department[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchDepartments: () => Promise<void>;
    addDepartment: (department: DepartmentCreate) => Promise<void>;
    updateDepartment: (id: number, updates: Partial<DepartmentCreate>) => Promise<void>;
    deleteDepartment: (id: number) => Promise<void>;
    getDepartmentById: (id: number) => Department | undefined;
}

export const useDepartmentStore = create<DepartmentStore>()(
    persist(
        (set, get) => ({
            departments: [],
            loading: false,
            error: null,

            fetchDepartments: async () => {
                set({ loading: true, error: null });
                try {
                    const departments = await api.getDepartments();
                    set({ departments, loading: false });
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            addDepartment: async (department) => {
                set({ loading: true, error: null });
                try {
                    const newDept = await api.createDepartment(department);
                    set((state) => ({
                        departments: [...state.departments, newDept],
                        loading: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            updateDepartment: async (id, updates) => {
                set({ loading: true, error: null });
                try {
                    const updatedDept = await api.updateDepartment(id, updates);
                    set((state) => ({
                        departments: state.departments.map((dept) =>
                            dept.id === id ? updatedDept : dept
                        ),
                        loading: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            deleteDepartment: async (id) => {
                set({ loading: true, error: null });
                try {
                    await api.deleteDepartment(id);
                    set((state) => ({
                        departments: state.departments.filter((dept) => dept.id !== id),
                        loading: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message, loading: false });
                }
            },

            getDepartmentById: (id) => {
                return get().departments.find((dept) => dept.id === id);
            },
        }),
        {
            name: 'department-storage',
        }
    )
);
