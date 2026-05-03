"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'ADMIN' | 'USER' | null;

interface User {
    id: number;
    phone: string;
    role: Role;
    fullName?: string | null;
    savedAddress?: string | null;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;

    login: (user: User) => void;
    logout: () => void;
    updateProfile: (fullName: string | null, savedAddress: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            user: null,

            login: (user) => set({
                isAuthenticated: true,
                user
            }),

            logout: async () => {
                try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                } catch (err) {
                    console.error("Cookie cleanup failed", err);
                } finally {
                    set({ isAuthenticated: false, user: null });
                    window.location.href = '/';
                }
            },

            updateProfile: (fullName, savedAddress) => {
                const current = get().user;
                if (!current) return;
                set({ user: { ...current, fullName, savedAddress } });
            },
        }),
        {
            name: 'batristore-auth',
        }
    )
);
