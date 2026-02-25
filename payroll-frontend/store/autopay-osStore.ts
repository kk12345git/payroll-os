import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, type SalaryStructure, type AutoPayOSRecord, type SalaryStructureUpdate, type SalaryStructureCreate, type AutoPayOSSummary } from '../lib/api';

interface AutoPayOSStore {
    salaryStructures: Record<number, SalaryStructure>; // employeeId -> structure
    autopayOSRecords: AutoPayOSRecord[];
    monthlySummaries: AutoPayOSSummary[];
    selectedMonth: string;
    loading: boolean;
    error: string | null;

    // Actions
    fetchSalaryStructure: (employeeId: number) => Promise<void>;
    updateSalaryStructure: (employeeId: number, structure: SalaryStructureUpdate) => Promise<void>;
    createSalaryStructure: (structure: SalaryStructureCreate) => Promise<void>;
    processAutoPayOS: (month: number, year: number, employeeIds: number[]) => Promise<void>;
    fetchAutoPayOSHistory: (employeeId: number) => Promise<void>;
    fetchAutoPayOSSummaries: () => Promise<void>;
    setSelectedMonth: (month: string) => void;

    // Selectors
    getSalaryStructure: (employeeId: number) => SalaryStructure | undefined;
    getAutoPayOSByMonth: (month: number, year: number) => AutoPayOSRecord[];
}

export const useAutoPayOSStore = create<AutoPayOSStore>()(
    persist(
        (set, get) => ({
            salaryStructures: {},
            autopayOSRecords: [],
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

            processAutoPayOS: async (month, year, employeeIds) => {
                set({ loading: true, error: null });
                try {
                    const records = await api.processAutoPayOS({ employee_ids: employeeIds, month, year });
                    set((state) => ({
                        autopayOSRecords: [...state.autopayOSRecords, ...records],
                        loading: false
                    }));
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                    throw err;
                }
            },

            fetchAutoPayOSHistory: async (employeeId) => {
                set({ loading: true, error: null });
                try {
                    const history = await api.getAutoPayOSHistory(employeeId);
                    set((state) => {
                        // Merge history avoiding duplicates
                        const otherRecords = state.autopayOSRecords.filter(r => r.employee_id !== employeeId);
                        return {
                            autopayOSRecords: [...otherRecords, ...history],
                            loading: false
                        };
                    });
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            fetchAutoPayOSSummaries: async () => {
                set({ loading: true, error: null });
                try {
                    const summaries = await api.getAutoPayOSSummaries();
                    set({ monthlySummaries: summaries, loading: false });
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            setSelectedMonth: (month) => set({ selectedMonth: month }),

            getSalaryStructure: (employeeId) => {
                return get().salaryStructures[employeeId];
            },

            getAutoPayOSByMonth: (month, year) => {
                return get().autopayOSRecords.filter(
                    (record) => record.month === month && record.year === year
                );
            },
        }),
        {
            name: 'autopay-os-autopay-os',
            version: 2,
        }
    )
);
