"use client";

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/useThemeStore';
import '../i18n'; // This initializes i18next the moment the app loads

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    const { mode } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // This ensures we only run client-side code AFTER the component has mounted in the browser
    useEffect(() => {
        setMounted(true);
    }, []);

    // Apply your specific [data-mode="dark"] attribute to the HTML tag
    useEffect(() => {
        if (mounted) {
            if (mode === 'dark') {
                document.documentElement.setAttribute('data-mode', 'dark');
            } else {
                document.documentElement.removeAttribute('data-mode');
            }
        }
    }, [mode, mounted]);

    // Prevent the hydration flash by hiding the UI for a split second until Zustand is ready
    if (!mounted) {
        return <div className="min-h-screen bg-background opacity-0 transition-opacity duration-300"></div>;
    }

    // Once ready, render the whole app!
    return <>{children}</>;
}