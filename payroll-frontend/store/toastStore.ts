import { create } from 'zustand';

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],

    addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        const newToast = { ...toast, id };

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));

        // Auto remove after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter(t => t.id !== id),
            }));
        }, duration);
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter(t => t.id !== id),
        }));
    },

    clearAllToasts: () => {
        set({ toasts: [] });
    },
}));

// Convenience hook for easy usage
export const useToast = () => {
    const { addToast } = useToastStore();

    return {
        success: (message: string, duration?: number) => addToast({ type: 'success', message, duration }),
        error: (message: string, duration?: number) => addToast({ type: 'error', message, duration }),
        warning: (message: string, duration?: number) => addToast({ type: 'warning', message, duration }),
        info: (message: string, duration?: number) => addToast({ type: 'info', message, duration }),
    };
};
