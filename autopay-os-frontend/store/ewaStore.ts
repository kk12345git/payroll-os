import { create } from 'zustand';
import { api, type EWABalance, type EWAWithdrawal } from '@/lib/api';

interface EWAStore {
    balance: EWABalance | null;
    history: EWAWithdrawal[];
    pendingRequests: EWAWithdrawal[]; // For admin
    loading: boolean;
    error: string | null;

    fetchBalance: () => Promise<void>;
    fetchHistory: () => Promise<void>;
    requestWithdrawal: (amount: number, notes?: string) => Promise<void>;

    // Admin actions
    fetchPendingRequests: () => Promise<void>;
    processRequest: (id: number, action: 'approve' | 'reject') => Promise<void>;
}

export const useEWAStore = create<EWAStore>((set, get) => ({
    balance: null,
    history: [],
    pendingRequests: [],
    loading: false,
    error: null,

    fetchBalance: async () => {
        set({ loading: true, error: null });
        try {
            const data = await api.getEWABalance();
            set({ balance: data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    fetchHistory: async () => {
        set({ loading: true, error: null });
        try {
            const data = await api.getEWAHistory();
            set({ history: data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    requestWithdrawal: async (amount, notes) => {
        set({ loading: true, error: null });
        try {
            await api.requestEWA(amount, notes);
            // Refresh balance and history
            await get().fetchBalance();
            await get().fetchHistory();
            set({ loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
            throw err; // Re-throw for UI handling
        }
    },

    fetchPendingRequests: async () => {
        set({ loading: true, error: null });
        try {
            const data = await api.getPendingEWA();
            set({ pendingRequests: data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    processRequest: async (id, action) => {
        set({ loading: true, error: null });
        try {
            await api.processEWA(id, action);
            // Refresh pending list
            const currentPending = get().pendingRequests;
            set({
                pendingRequests: currentPending.filter(r => r.id !== id),
                loading: false
            });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    }
}));
