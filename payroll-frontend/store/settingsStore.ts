import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompanySettings {
    companyName: string;
    legalName: string;
    panNumber: string;
    tanNumber: string;
    gstNumber: string;
    pfNumber: string;
    esiNumber: string;
    address: string;
    phone: string;
    email: string;
    simpleMode: boolean;
}

interface StatutorySettings {
    pf: {
        employeeRate: number;
        employerRate: number;
        threshold: number;
        adminCharges: number;
        edliCharges: number;
    };
    esi: {
        employeeRate: number;
        employerRate: number;
        threshold: number;
    };
    pt: {
        enabled: boolean;
        state: string;
        deductionMonth: string;
    };
    lwf: {
        enabled: boolean;
        employeeAmount: number;
        employerAmount: number;
    };
}

interface SettingsStore {
    companySettings: CompanySettings;
    statutorySettings: StatutorySettings;

    // Actions
    updateCompanySettings: (settings: Partial<CompanySettings>) => void;
    updateStatutorySettings: (settings: Partial<StatutorySettings>) => void;
    updatePFSettings: (settings: Partial<StatutorySettings['pf']>) => void;
    updateESISettings: (settings: Partial<StatutorySettings['esi']>) => void;
    updatePTSettings: (settings: Partial<StatutorySettings['pt']>) => void;
    updateLWFSettings: (settings: Partial<StatutorySettings['lwf']>) => void;
    toggleSimpleMode: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            companySettings: {
                companyName: '',
                legalName: '',
                panNumber: '',
                tanNumber: '',
                gstNumber: '',
                pfNumber: '',
                esiNumber: '',
                address: '',
                phone: '',
                email: '',
                simpleMode: true,
            },

            statutorySettings: {
                pf: {
                    employeeRate: 12,
                    employerRate: 12,
                    threshold: 15000,
                    adminCharges: 1.1,
                    edliCharges: 0.5,
                },
                esi: {
                    employeeRate: 0.75,
                    employerRate: 3.25,
                    threshold: 21000,
                },
                pt: {
                    enabled: true,
                    state: '',
                    deductionMonth: '',
                },
                lwf: {
                    enabled: true,
                    employeeAmount: 0,
                    employerAmount: 0,
                },
            },

            updateCompanySettings: (settings) => set((state) => ({
                companySettings: { ...state.companySettings, ...settings },
            })),

            updateStatutorySettings: (settings) => set((state) => ({
                statutorySettings: { ...state.statutorySettings, ...settings },
            })),

            updatePFSettings: (settings) => set((state) => ({
                statutorySettings: {
                    ...state.statutorySettings,
                    pf: { ...state.statutorySettings.pf, ...settings },
                },
            })),

            updateESISettings: (settings) => set((state) => ({
                statutorySettings: {
                    ...state.statutorySettings,
                    esi: { ...state.statutorySettings.esi, ...settings },
                },
            })),

            updatePTSettings: (settings) => set((state) => ({
                statutorySettings: {
                    ...state.statutorySettings,
                    pt: { ...state.statutorySettings.pt, ...settings },
                },
            })),

            updateLWFSettings: (settings) => set((state) => ({
                statutorySettings: {
                    ...state.statutorySettings,
                    lwf: { ...state.statutorySettings.lwf, ...settings },
                },
            })),
            toggleSimpleMode: (enabled) => set((state) => ({
                companySettings: { ...state.companySettings, simpleMode: enabled },
            })),
        }),
        {
            name: 'autopay-os-settings',
            version: 2,
        }
    )
);
