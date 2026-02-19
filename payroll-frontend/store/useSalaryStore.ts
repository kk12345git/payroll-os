import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Salary Component Types
export interface SalaryComponent {
    id: string;
    name: string;
    code: string;
    type: 'earning' | 'deduction';
    calculationType: 'fixed' | 'percentage' | 'formula';
    value: number;
    baseComponent?: string; // For percentage-based components
    isTaxable: boolean;
    isPFApplicable: boolean;
    isESIApplicable: boolean;
    isStatutory: boolean;
    description?: string;
}

export interface SalaryStructure {
    id: string;
    name: string;
    description?: string;
    components: SalaryComponent[];
    ctc: number;
    grossSalary: number;
    netSalary: number;
    employeeId?: string;
    effectiveFrom: string;
    isActive: boolean;
    createdAt: string;
}

interface SalaryStore {
    components: SalaryComponent[];
    structures: SalaryStructure[];
    addComponent: (component: Omit<SalaryComponent, 'id'>) => void;
    updateComponent: (id: string, component: Partial<SalaryComponent>) => void;
    deleteComponent: (id: string) => void;
    addStructure: (structure: Omit<SalaryStructure, 'id' | 'createdAt'>) => void;
    updateStructure: (id: string, structure: Partial<SalaryStructure>) => void;
    deleteStructure: (id: string) => void;
    calculateCTC: (components: SalaryComponent[]) => { ctc: number; gross: number; net: number };
}

// Default Indian salary components
const defaultComponents: SalaryComponent[] = [
    {
        id: '1',
        name: 'Basic Salary',
        code: 'BASIC',
        type: 'earning',
        calculationType: 'fixed',
        value: 0,
        isTaxable: true,
        isPFApplicable: true,
        isESIApplicable: true,
        isStatutory: false,
    },
    {
        id: '2',
        name: 'House Rent Allowance',
        code: 'HRA',
        type: 'earning',
        calculationType: 'percentage',
        value: 40,
        baseComponent: 'BASIC',
        isTaxable: true,
        isPFApplicable: false,
        isESIApplicable: false,
        isStatutory: false,
    },
    {
        id: '3',
        name: 'Dearness Allowance',
        code: 'DA',
        type: 'earning',
        calculationType: 'percentage',
        value: 20,
        baseComponent: 'BASIC',
        isTaxable: true,
        isPFApplicable: true,
        isESIApplicable: true,
        isStatutory: false,
    },
    {
        id: '4',
        name: 'Conveyance Allowance',
        code: 'CONVEYANCE',
        type: 'earning',
        calculationType: 'fixed',
        value: 1600,
        isTaxable: false,
        isPFApplicable: false,
        isESIApplicable: false,
        isStatutory: false,
    },
    {
        id: '5',
        name: 'Medical Allowance',
        code: 'MEDICAL',
        type: 'earning',
        calculationType: 'fixed',
        value: 1250,
        isTaxable: false,
        isPFApplicable: false,
        isESIApplicable: false,
        isStatutory: false,
    },
    {
        id: '6',
        name: 'Special Allowance',
        code: 'SPECIAL',
        type: 'earning',
        calculationType: 'fixed',
        value: 0,
        isTaxable: true,
        isPFApplicable: false,
        isESIApplicable: false,
        isStatutory: false,
    },
    {
        id: '7',
        name: 'Provident Fund (Employee)',
        code: 'PF_EMPLOYEE',
        type: 'deduction',
        calculationType: 'percentage',
        value: 12,
        baseComponent: 'BASIC',
        isTaxable: false,
        isPFApplicable: false,
        isESIApplicable: false,
        isStatutory: true,
    },
    {
        id: '8',
        name: 'ESI (Employee)',
        code: 'ESI_EMPLOYEE',
        type: 'deduction',
        calculationType: 'percentage',
        value: 0.75,
        baseComponent: 'GROSS',
        isTaxable: false,
        isPFApplicable: false,
        isESIApplicable: false,
        isStatutory: true,
    },
    {
        id: '9',
        name: 'Professional Tax',
        code: 'PT',
        type: 'deduction',
        calculationType: 'fixed',
        value: 200,
        isTaxable: false,
        isPFApplicable: false,
        isESIApplicable: false,
        isStatutory: true,
    },
    {
        id: '10',
        name: 'Income Tax (TDS)',
        code: 'TDS',
        type: 'deduction',
        calculationType: 'fixed',
        value: 0,
        isTaxable: false,
        isPFApplicable: false,
        isESIApplicable: false,
        isStatutory: true,
    },
];

export const useSalaryStore = create<SalaryStore>()(
    persist(
        (set, get) => ({
            components: defaultComponents,
            structures: [],

            addComponent: (component) => {
                const newComponent: SalaryComponent = {
                    ...component,
                    id: Date.now().toString(),
                };
                set((state) => ({
                    components: [...state.components, newComponent],
                }));
            },

            updateComponent: (id, updates) => {
                set((state) => ({
                    components: state.components.map((comp) =>
                        comp.id === id ? { ...comp, ...updates } : comp
                    ),
                }));
            },

            deleteComponent: (id) => {
                set((state) => ({
                    components: state.components.filter((comp) => comp.id !== id),
                }));
            },

            addStructure: (structure) => {
                const newStructure: SalaryStructure = {
                    ...structure,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    structures: [...state.structures, newStructure],
                }));
            },

            updateStructure: (id, updates) => {
                set((state) => ({
                    structures: state.structures.map((struct) =>
                        struct.id === id ? { ...struct, ...updates } : struct
                    ),
                }));
            },

            deleteStructure: (id) => {
                set((state) => ({
                    structures: state.structures.filter((struct) => struct.id !== id),
                }));
            },

            calculateCTC: (components) => {
                let gross = 0;
                let deductions = 0;

                // Calculate earnings
                components.forEach((comp) => {
                    if (comp.type === 'earning') {
                        if (comp.calculationType === 'fixed') {
                            gross += comp.value;
                        } else if (comp.calculationType === 'percentage' && comp.baseComponent) {
                            const baseComp = components.find((c) => c.code === comp.baseComponent);
                            if (baseComp) {
                                gross += (baseComp.value * comp.value) / 100;
                            }
                        }
                    }
                });

                // Calculate deductions
                components.forEach((comp) => {
                    if (comp.type === 'deduction') {
                        if (comp.calculationType === 'fixed') {
                            deductions += comp.value;
                        } else if (comp.calculationType === 'percentage' && comp.baseComponent) {
                            if (comp.baseComponent === 'GROSS') {
                                deductions += (gross * comp.value) / 100;
                            } else {
                                const baseComp = components.find((c) => c.code === comp.baseComponent);
                                if (baseComp) {
                                    deductions += (baseComp.value * comp.value) / 100;
                                }
                            }
                        }
                    }
                });

                const net = gross - deductions;
                const ctc = gross; // CTC includes employer contributions (PF, ESI) but simplified here

                return { ctc, gross, net };
            },
        }),
        {
            name: 'salary-storage',
        }
    )
);
