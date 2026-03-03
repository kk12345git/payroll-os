"use client";

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('dark');
    }, []);

    return <>{children}</>;
}
