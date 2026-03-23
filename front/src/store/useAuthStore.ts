"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the roles available in our system
export type Role = 'ADMIN' | 'USER' | null;

interface User {
    id: number;
    phone: string;
    role: Role;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;

    // Actions
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            token: null,

            // Call this after the OTP is successfully verified
            login: (user, token) => set({
                isAuthenticated: true,
                user,
                token
            }),

            // Call this when the user clicks "Log out"
            logout: () => set({
                isAuthenticated: false,
                user: null,
                token: null
            }),
        }),
        {
            name: 'batristore-auth', // Saves their session to LocalStorage so they stay logged in!
        }
    )
);