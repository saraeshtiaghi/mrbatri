"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'ADMIN' | 'USER' | null;

interface User {
    id: number;
    phone: string;
    role: Role;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;

    // Notice: The token is completely gone!
    login: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,

            // We only save the user data now. The browser cookie holds the token.
            login: (user) => set({
                isAuthenticated: true,
                user
            }),

            logout: async () => {
                try {
                    // Hit the proxy to kill the cookie
                    await fetch('/api/auth/logout', { method: 'POST' });
                } catch (err) {
                    console.error("Cookie cleanup failed", err);
                } finally {
                    // Always clear the local UI state regardless
                    set({
                        isAuthenticated: false,
                        user: null,
                    });
                    // Optional: Redirect to home or login
                    window.location.href = '/';
                }
            },
        }),
        {
            name: 'batristore-auth',
        }
    )
);