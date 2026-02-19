/**
 * Responsive Table Component
 * 
 * Desktop: Traditional table layout
 * Mobile: Card-based layout with stacked fields
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    mobileLabel?: string;
    hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
}

export function ResponsiveTable<T extends { id: string | number }>({
    data,
    columns,
    onRowClick,
    emptyMessage = "No data available"
}: ResponsiveTableProps<T>) {

    if (data.length === 0) {
        return (
            <div className="card-extreme text-center py-12">
                <p className="text-slate-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden lg:block card-extreme overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-slate-200">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="text-left py-4 px-4 font-black text-slate-900 text-sm uppercase tracking-wide"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                onClick={() => onRowClick?.(item)}
                                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''
                                    }`}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="py-4 px-4 text-slate-700">
                                        {column.render
                                            ? column.render(item)
                                            : String((item as any)[column.key] || '-')}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
                {data.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onRowClick?.(item)}
                        className={`card-extreme ${onRowClick ? 'cursor-pointer active:scale-[0.98]' : ''} transition-transform`}
                    >
                        <div className="space-y-3">
                            {columns
                                .filter(col => !col.hideOnMobile)
                                .map((column) => (
                                    <div key={column.key} className="flex justify-between items-start gap-4">
                                        <span className="text-sm font-semibold text-slate-500 flex-shrink-0">
                                            {column.mobileLabel || column.label}
                                        </span>
                                        <div className="text-sm font-bold text-slate-900 text-right">
                                            {column.render
                                                ? column.render(item)
                                                : String((item as any)[column.key] || '-')}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </>
    );
}
