import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, type SalaryStructure, type PayrollRecord, type SalaryStructureUpdate, type SalaryStructureCreate, type PayrollSummary } from '../lib/api';

interface PayrollStore {
    salaryStructures: Record<number, SalaryStructure>; // employeeId -> structure
    payrollRecords: PayrollRecord[];
    monthlySummaries: PayrollSummary[];
    selectedMonth: string;
    loading: boolean;
    error: string | null;

    // Actions
    fetchSalaryStructure: (employeeId: number) => Promise<void>;
    updateSalaryStructure: (employeeId: number, structure: SalaryStructureUpdate) => Promise<void>;
    createSalaryStructure: (structure: SalaryStructureCreate) => Promise<void>;
    processPayroll: (month: number, year: number, employeeIds: number[]) => Promise<void>;
    fetchPayrollHistory: (employeeId: number) => Promise<void>;
    fetchPayrollSummaries: () => Promise<void>;
    setSelectedMonth: (month: string) => void;

    // Selectors
    getSalaryStructure: (employeeId: number) => SalaryStructure | undefined;
    getPayrollByMonth: (month: number, year: number) => PayrollRecord[];
}

export const usePayrollStore = create<PayrollStore>()(
    persist(
        (set, get) => ({
            salaryStructures: {},
            payrollRecords: [],
            monthlySummaries: [],
            selectedMonth: new Date().toISOString().substring(0, 7),
            loading: false,
            error: null,

            fetchSalaryStructure: async (employeeId) => {
                set({ loading: true, error: null });
                try {
                    const structure = await api.getSalaryStructure(employeeId);
                    set((state) => ({
                        salaryStructures: {
                            ...state.salaryStructures,
                            [employeeId]: structure
                        },
                        loading: false
                    }));
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            updateSalaryStructure: async (employeeId, structure) => {
                set({ loading: true, error: null });
                try {
                    const updated = await api.updateSalaryStructure(employeeId, structure);
                    set((state) => ({
                        salaryStructures: {
                            ...state.salaryStructures,
                            [employeeId]: updated
                        },
                        loading: false
                    }));
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                    throw err;
                }
            },

            createSalaryStructure: async (structure) => {
                set({ loading: true, error: null });
                try {
                    const created = await api.createSalaryStructure(structure);
                    set((state) => ({
                        salaryStructures: {
                            ...state.salaryStructures,
                            [structure.employee_id]: created
                        },
                        loading: false
                    }));
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                    throw err;
                }
            },

            processPayroll: async (month, year, employeeIds) => {
                set({ loading: true, error: null });
                try {
                    const records = await api.processPayroll({ employee_ids: employeeIds, month, year });
                    set((state) => ({
                        payrollRecords: [...state.payrollRecords, ...records],
                        loading: false
                    }));
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                    throw err;
                }
            },

            fetchPayrollHistory: async (employeeId) => {
                set({ loading: true, error: null });
                try {
                    const history = await api.getPayrollHistory(employeeId);
                    set((state) => {
                        // Merge history avoiding duplicates
                        const otherRecords = state.payrollRecords.filter(r => r.employee_id !== employeeId);
                        return {
                            payrollRecords: [...otherRecords, ...history],
                            loading: false
                        };
                    });
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            fetchPayrollSummaries: async () => {
                set({ loading: true, error: null });
                try {
                    const summaries = await api.getPayrollSummaries();
                    set({ monthlySummaries: summaries, loading: false });
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            setSelectedMonth: (month) => set({ selectedMonth: month }),

            getSalaryStructure: (employeeId) => {
                return get().salaryStructures[employeeId];
            },

            getPayrollByMonth: (month, year) => {
                return get().payrollRecords.filter(
                    (record) => record.month === month && record.year === year
                );
            },
        }),
        {
            name: 'payroll-payroll',
            version: 2,
        }
    )
);
