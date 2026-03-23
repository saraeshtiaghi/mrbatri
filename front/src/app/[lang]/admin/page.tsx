"use client"; // We use client here because we're reading from Zustand store

import { useAuthStore } from '@/store/useAuthStore';

export default function AdminDashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-on-surface">Admin Dashboard</h1>
                <p className="text-on-surface-muted">Welcome, {user?.phone}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-surface border border-outline rounded-3xl shadow-sm">
                    <p className="text-sm font-bold text-on-surface-muted uppercase">Sales</p>
                    <p className="text-4xl font-black text-primary mt-2">$12,450</p>
                </div>
                <div className="p-8 bg-surface border border-outline rounded-3xl shadow-sm">
                    <p className="text-sm font-bold text-on-surface-muted uppercase">Orders</p>
                    <p className="text-4xl font-black text-on-surface mt-2">24</p>
                </div>
                <div className="p-8 bg-surface border border-outline rounded-3xl shadow-sm">
                    <p className="text-sm font-bold text-on-surface-muted uppercase">Low Stock</p>
                    <p className="text-4xl font-black text-error mt-2">3</p>
                </div>
            </div>
        </div>
    );
}