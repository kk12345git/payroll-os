import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, type Anomaly } from '@/lib/api';

interface AnomalyStore {
    anomalies: Anomaly[];
    loading: boolean;
    error: string | null;
    fetchAnomalies: (resolved?: boolean) => Promise<void>;
    resolveAnomaly: (id: number, notes: string) => Promise<void>;
}

export const useAnomalyStore = create<AnomalyStore>()(
    persist(
        (set, get) => ({
            anomalies: [],
            loading: false,
            error: null,

            fetchAnomalies: async (resolved) => {
                set({ loading: true, error: null });
                try {
                    const data = await api.getAnomalies(resolved);
                    set({ anomalies: data, loading: false });
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },

            resolveAnomaly: async (id, notes) => {
                set({ loading: true, error: null });
                try {
                    await api.resolveAnomaly(id, notes);
                    // Update local state
                    set({
                        anomalies: get().anomalies.map(a =>
                            a.id === id ? { ...a, is_resolved: true } : a
                        ),
                        loading: false
                    });
                } catch (err: any) {
                    set({ error: err.message, loading: false });
                }
            },
        }),
        {
            name: 'anomaly-storage',
            version: 1,
        }
    )
);
