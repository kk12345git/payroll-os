import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AttendanceRecord } from '../lib/api';

interface AttendanceStore {
    attendanceRecords: AttendanceRecord[];
    selectedDate: string;
    selectedMonth: string;

    // Actions
    setAttendanceRecords: (records: AttendanceRecord[]) => void;
    addAttendanceRecord: (record: AttendanceRecord) => void;
    updateAttendanceRecord: (id: number, record: Partial<AttendanceRecord>) => void;
    deleteAttendanceRecord: (id: number) => void;
    bulkAddAttendance: (records: AttendanceRecord[]) => void;
    setSelectedDate: (date: string) => void;
    setSelectedMonth: (month: string) => void;
    getAttendanceByDate: (date: string) => AttendanceRecord[];
    getAttendanceByEmployee: (employeeId: number) => AttendanceRecord[];
    getAttendanceByMonth: (month: string) => AttendanceRecord[];
    getMonthlyStats: (employeeId: number, month: string) => {
        present: number;
        absent: number;
        halfDay: number;
        leave: number;
        total: number;
    };
}

export const useAttendanceStore = create<AttendanceStore>()(
    persist(
        (set, get) => ({
            attendanceRecords: [],
            selectedDate: new Date().toISOString().split('T')[0],
            selectedMonth: new Date().toISOString().substring(0, 7),

            setAttendanceRecords: (records) => set({ attendanceRecords: records }),

            addAttendanceRecord: (record) => set((state) => ({
                attendanceRecords: [...state.attendanceRecords, record],
            })),

            updateAttendanceRecord: (id, updatedRecord) => set((state) => ({
                attendanceRecords: state.attendanceRecords.map((rec) =>
                    rec.id === id ? { ...rec, ...updatedRecord } : rec
                ),
            })),

            deleteAttendanceRecord: (id) => set((state) => ({
                attendanceRecords: state.attendanceRecords.filter((rec) => rec.id !== id),
            })),

            bulkAddAttendance: (records) => set((state) => ({
                attendanceRecords: [...state.attendanceRecords, ...records],
            })),

            setSelectedDate: (date) => set({ selectedDate: date }),

            setSelectedMonth: (month) => set({ selectedMonth: month }),

            getAttendanceByDate: (date) => {
                const { attendanceRecords } = get();
                return attendanceRecords.filter((rec) => rec.date === date);
            },

            getAttendanceByEmployee: (employeeId) => {
                const { attendanceRecords } = get();
                return attendanceRecords.filter((rec) => rec.employee_id === employeeId);
            },

            getAttendanceByMonth: (month) => {
                const { attendanceRecords } = get();
                return attendanceRecords.filter((rec) => rec.date && rec.date.startsWith(month));
            },

            getMonthlyStats: (employeeId, month) => {
                const { attendanceRecords } = get();
                const records = attendanceRecords.filter(
                    (rec) => rec.employee_id === employeeId && rec.date && rec.date.startsWith(month)
                );

                return {
                    present: records.filter((r) => r.status === 'present').length,
                    absent: records.filter((r) => r.status === 'absent').length,
                    halfDay: records.filter((r) => r.status === 'half-day').length,
                    leave: records.filter((r) => r.status === 'leave').length,
                    total: records.length,
                };
            },
        }),
        {
            name: 'payroll-attendance',
            version: 2,
        }
    )
);
