'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
    LogOut,
    LayoutDashboard,
    Users,
    Building2,
    Wallet,
    ClipboardCheck,
    PieChart,
    Settings,
    Menu,
    Bell,
    Search,
    User as UserIcon,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
    Command as CommandIcon,
    IndianRupee,
    Gem,
    Brain,
    MessageSquare,
    TrendingUp,
    ShieldCheck,
    CreditCard,
    UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/themeStore';
import dynamic from 'next/dynamic';
import Logo from '@/components/Logo';
import { LoadingOverlay } from '@/components/Loading';
import { AIFloatingChat } from '@/components/ai/AIFloatingChat';

const CommandPalette = dynamic(() => import('@/components/CommandPalette'), {
    ssr: false,
});

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, loading, user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
    const { theme, toggleTheme } = useThemeStore();

    // Command Palette Keyboard Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Auto-hide sidebar on mobile by default
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    const navItems = [
        // Admin/HR Items
        { title: 'Overview', icon: LayoutDashboard, href: '/dashboard', roles: ['admin', 'hr_manager'] },
        { title: 'AI Copilot', icon: Brain, href: '/dashboard/copilot', roles: ['admin', 'hr_manager'] },
        { title: 'Cash Flow AI', icon: TrendingUp, href: '/dashboard/analytics/forecast', roles: ['admin', 'hr_manager'] },
        { title: 'Compliance', icon: ShieldCheck, href: '/dashboard/compliance', roles: ['admin', 'hr_manager'] },
        { title: 'Billing', icon: CreditCard, href: '/dashboard/billing', roles: ['admin', 'hr_manager'] },
        { title: 'Sales Admin', icon: TrendingUp, href: '/admin/sales', roles: ['admin'] },
        { title: 'Recruit & Invite', icon: UserPlus, href: '/dashboard/settings/invites', roles: ['admin', 'hr_manager'] },
        { title: 'Employees', icon: Users, href: '/dashboard/employees', roles: ['admin', 'hr_manager'] },
        { title: 'Departments', icon: Building2, href: '/dashboard/departments', roles: ['admin', 'hr_manager'] },
        { title: 'Payroll', icon: Wallet, href: '/dashboard/payroll', roles: ['admin', 'hr_manager', 'accountant'] },
        { title: 'Attendance', icon: ClipboardCheck, href: '/dashboard/attendance', roles: ['admin', 'hr_manager'] },
        { title: 'Reports', icon: PieChart, href: '/dashboard/reports', roles: ['admin', 'hr_manager', 'accountant'] },

        // Universal / Employee Items
        { title: 'Employee Portal', icon: UserIcon, href: '/dashboard/ess', roles: ['admin', 'hr_manager', 'employee', 'accountant'] },
        { title: 'EWA (Salary Access)', icon: Wallet, href: '/dashboard/ewa', roles: ['admin', 'hr_manager', 'employee'] },
        { title: 'Tax Optimizer (AI)', icon: Brain, href: '/dashboard/payroll/tax-optimizer', roles: ['admin', 'hr_manager', 'employee'] },

        // Admin Settings
        { title: 'WhatsApp (Beta)', icon: MessageSquare, href: '/dashboard/integrations/whatsapp', roles: ['admin'] },
        { title: 'Subscription', icon: Gem, href: '/dashboard/settings/subscription', roles: ['admin'] },
        { title: 'Control Panel', icon: Settings, href: '/dashboard/settings', roles: ['admin'] },
    ];

    const filteredNavItems = navItems.filter(item =>
        !item.roles || item.roles.includes(user?.role || 'employee')
    );

    if (loading) {
        return <LoadingOverlay message="Synchronizing payroll data..." />;
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <div className="mesh-bg opacity-40 dark:opacity-10" />

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop: collapsible, Mobile: drawer */}
            <AnimatePresence mode="popLayout">
                <motion.aside
                    key="desktop-sidebar"
                    className={cn(
                        "fixed top-0 left-0 h-full bg-card/70 backdrop-blur-2xl border-r border-border/50 z-50 transition-all duration-700",
                        // Desktop
                        "hidden lg:block",
                        sidebarOpen ? "w-72" : "w-24",
                    )}
                >
                    <div className="flex flex-col h-full relative">
                        {/* Desktop Collapse Toggle */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="absolute -right-3 top-24 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 z-50 hover:scale-110 transition-transform"
                        >
                            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        {/* Sidebar Header */}
                        <div className="h-24 flex items-center px-6">
                            <Logo showText={sidebarOpen} size={sidebarOpen ? "md" : "lg"} />
                        </div>

                        {/* Navigation Items */}
                        <nav className="flex-1 px-4 space-y-2 py-8">
                            {filteredNavItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                                                : "text-muted-foreground hover:bg-accent/10 hover:text-foreground hover:shadow-lg hover:shadow-accent/5"
                                        )}
                                    >
                                        <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110 duration-300", isActive ? "text-white" : "group-hover:text-indigo-600")} />
                                        {sidebarOpen && <span className="font-bold text-[13px] uppercase tracking-wide">{item.title}</span>}

                                        {isActive && (
                                            <motion.div
                                                layoutId="active-glow"
                                                className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Section Bottom */}
                        <div className="p-6">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-[1.25rem] transition-all duration-300 font-bold text-[13px] uppercase tracking-wide group"
                            >
                                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                {sidebarOpen && <span>Sign Out</span>}
                            </button>
                        </div>
                    </div>
                </motion.aside>
            </AnimatePresence>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-2xl border-r border-white/50 z-50 lg:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col h-full">
                            {/* Mobile Header with Close */}
                            <div className="h-24 flex items-center justify-between px-6 border-b border-slate-200">
                                <Logo size="md" />
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            <nav className="flex-1 px-4 space-y-2 py-8">
                                {filteredNavItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300",
                                                isActive
                                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-bold text-sm uppercase tracking-wide">{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Mobile Logout */}
                            <div className="p-6 border-t border-slate-200">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-[1.25rem] transition-all font-bold text-sm uppercase tracking-wide"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main
                className={cn(
                    "transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1) min-h-screen",
                    sidebarOpen ? "lg:pl-72" : "lg:pl-24",
                    "lg:ml-0"
                )}
            >
                {/* Top Header */}
                <header className="h-24 bg-card/40 backdrop-blur-2xl sticky top-0 z-30 px-6 lg:px-10 flex items-center justify-between border-b border-border/50">
                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* Mobile Hamburger Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden w-12 h-12 flex items-center justify-center text-slate-700 hover:bg-white rounded-xl transition-all"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden lg:flex items-center gap-4 bg-card/50 px-6 py-3 rounded-2xl border border-border shadow-sm w-[400px] focus-within:w-[450px] transition-all duration-500 focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/30">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                placeholder="Find a command or report... (⌘+K)"
                                className="bg-transparent border-none text-[13px] focus:ring-0 w-full placeholder:text-muted-foreground font-bold tracking-tight"
                                onFocus={() => setCommandPaletteOpen(true)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-muted-foreground hover:bg-card hover:text-primary rounded-2xl transition-all hover:shadow-lg border border-transparent hover:border-border"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button className="relative w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-muted-foreground hover:bg-card hover:text-primary rounded-2xl transition-all hover:shadow-lg border border-transparent hover:border-border">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 lg:top-3.5 right-2 lg:right-3.5 w-2 h-2 bg-destructive rounded-full ring-2 lg:ring-4 ring-card" />
                        </button>

                        <div className="hidden sm:block h-8 w-px bg-slate-200" />

                        <div className="flex items-center gap-3 lg:gap-4 pl-2 group cursor-pointer">
                            <div className="text-right hidden md:block">
                                <p className="text-[11px] lg:text-[13px] font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-tight">{user?.full_name}</p>
                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                    <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform border-4 border-card">
                                <span className="text-white font-black text-lg">{user?.full_name?.charAt(0)}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-6 lg:p-12 max-w-[1700px] mx-auto min-h-[calc(100vh-6rem)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Command Palette */}
            <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
            />

            <AIFloatingChat />
        </div>
    );
}
