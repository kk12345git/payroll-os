'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { motion } from 'framer-motion';

interface ChartProps {
    data: any[];
    title: string;
    type: 'line' | 'pie';
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308'];

export function DashboardCharts({ data, title, type }: ChartProps) {
    if (type === 'line') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Transform summary data for line chart
        const chartData = data.map(s => ({
            name: monthNames[s.month - 1],
            gross: Number(s.total_gross),
            net: Number(s.total_net),
        })).reverse(); // Most recent last

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-extreme p-4 md:p-6 h-[300px] md:h-[400px]"
            >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-sm md:text-lg font-black text-slate-800 tracking-tight uppercase">{title}</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-indigo-500" />
                            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-purple-500" />
                            <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Net</span>
                        </div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={chartData} margin={{ left: -20, right: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                            tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            labelStyle={{ fontWeight: 900, fontSize: '12px', marginBottom: '4px', color: '#1e293b' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="gross"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorGross)"
                        />
                        <Area
                            type="monotone"
                            dataKey="net"
                            stroke="#a855f7"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorNet)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>
        );
    }

    if (type === 'pie') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-extreme p-4 md:p-6 h-[300px] md:h-[400px]"
            >
                <h3 className="text-sm md:text-lg font-black text-slate-800 tracking-tight uppercase mb-6">{title}</h3>
                <ResponsiveContainer width="100%" height="70%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 mt-4 overflow-y-auto max-h-[60px]">
                    {data.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2">
                            <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-[8px] md:text-[10px] font-black text-slate-500 truncate uppercase tracking-tighter">
                                {entry.name}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    return null;
}
