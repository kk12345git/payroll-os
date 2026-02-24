'use client';

import { useEffect, useState } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { useDepartmentStore } from '../store/useDepartmentStore';
import { useAttendanceStore } from '../store/attendanceStore';
import { useLeaveStore } from '../store/leaveStore';
import { useAutoPayOSStore } from '../store/payrollStore';
import { initializeMockData } from '../lib/mockData';

// Hook to initialize all mock data on first run
export function useInitializeData() {
    const [isInitialized, setIsInitialized] = useState(false);

    const { setEmployees } = useEmployeeStore();
    const { fetchDepartments } = useDepartmentStore();
    const { setAttendanceRecords } = useAttendanceStore();
    const { fetchLeaves, fetchLeaveTypes } = useLeaveStore();
    const { salaryStructures } = useAutoPayOSStore();

    useEffect(() => {
        const init = async () => {
            try {
                await Promise.all([
                    fetchDepartments(),
                    fetchLeaves(),
                    fetchLeaveTypes()
                ]);
                console.log('[DataInitializer] Live API data synchronized successfully.');
            } catch (error) {
                console.error('[DataInitializer] Synchronization failed:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        init();
    }, [fetchDepartments, fetchLeaves, fetchLeaveTypes]);

    return isInitialized;
}

// Export a provider component to wrap the app
export function DataInitializer({ children }: { children: React.ReactNode }) {
    const isInitialized = useInitializeData();

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading AutoPay-OS System...</h2>
                    <p className="text-slate-600">Initializing data and configurations</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
