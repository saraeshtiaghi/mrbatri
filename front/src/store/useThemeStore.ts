"use client"

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
    mode: ThemeMode;
    toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'light', // Default to light mode
            toggleMode: () => set((state) => ({
                mode: state.mode === 'light' ? 'dark' : 'light'
            })),
        }),
        {
            name: 'batristore-theme', // Saves to browser LocalStorage automatically
        }
    )
);