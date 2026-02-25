import { create } from 'zustand';
import { api, type LeaveApplication, type LeaveType } from '../lib/api';

interface LeaveBalance {
    leaveTypeId: number;
    leaveTypeName: string;
    annualLimit: number;
    used: number;
    available: number;
}

interface LeaveStore {
    leaveApplications: LeaveApplication[];
    leaveTypes: LeaveType[];
    loading: boolean;
    error: string | null;

    // Actions
    fetchLeaves: () => Promise<void>;
    fetchLeaveTypes: () => Promise<void>;
    applyLeave: (data: any) => Promise<void>;
    approveLeave: (id: number) => Promise<void>;
    rejectLeave: (id: number, reason: string) => Promise<void>;
    getLeavesByEmployee: (employeeId: number) => LeaveApplication[];
    getPendingLeaves: () => LeaveApplication[];
    getLeaveBalances: (employeeId: number) => LeaveBalance[];
}

export const useLeaveStore = create<LeaveStore>((set, get) => ({
    leaveApplications: [],
    leaveTypes: [],
    loading: false,
    error: null,

    fetchLeaves: async () => {
        set({ loading: true, error: null });
        try {
            const leaves = await api.getLeaves();
            set({ leaveApplications: leaves, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchLeaveTypes: async () => {
        set({ loading: true, error: null });
        try {
            const types = await api.getLeaveTypes();
            set({ leaveTypes: types, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    applyLeave: async (data) => {
        set({ loading: true, error: null });
        try {
            const newLeave = await api.applyLeave(data);
            set((state) => ({
                leaveApplications: [newLeave, ...state.leaveApplications],
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    approveLeave: async (id) => {
        set({ loading: true, error: null });
        try {
            const updatedLeave = await api.approveLeave(id);
            set((state) => ({
                leaveApplications: state.leaveApplications.map((app) =>
                    app.id === id ? updatedLeave : app
                ),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    rejectLeave: async (id, reason) => {
        set({ loading: true, error: null });
        try {
            const updatedLeave = await api.rejectLeave(id, reason);
            set((state) => ({
                leaveApplications: state.leaveApplications.map((app) =>
                    app.id === id ? updatedLeave : app
                ),
                loading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    getLeavesByEmployee: (employeeId) => {
        const { leaveApplications } = get();
        return leaveApplications.filter((app) => app.employee_id === employeeId);
    },

    getPendingLeaves: () => {
        const { leaveApplications } = get();
        return leaveApplications.filter((app) => app.status === 'Pending');
    },

    getLeaveBalances: (employeeId) => {
        const { leaveApplications, leaveTypes } = get();
        const employeeLeaves = leaveApplications.filter(
            (app) => app.employee_id === employeeId && app.status === 'Approved'
        );

        return leaveTypes.map((type) => {
            const used = employeeLeaves
                .filter((app) => app.leave_type_id === type.id)
                .reduce((sum, app) => sum + app.total_days, 0);

            return {
                leaveTypeId: type.id,
                leaveTypeName: type.name,
                annualLimit: type.annual_limit,
                used,
                available: Math.max(0, type.annual_limit - used),
            };
        });
    },
}));
