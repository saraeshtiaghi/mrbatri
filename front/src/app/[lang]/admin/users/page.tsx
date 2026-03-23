"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios"; // <-- Import apiClient

interface User {
    id: number;
    phone: string;
    role: string;
    joinedAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Use apiClient! It automatically points to your Next.js /api routes.
        apiClient.get('/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error("Failed to load users", err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div className="p-8 text-on-surface animate-pulse">Loading users...</div>;

    return (
        <div className="bg-surface border border-outline rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline">
                <h2 className="text-2xl font-black text-on-surface">Users</h2>
                <p className="text-sm text-on-surface-muted">Manage registered accounts and roles</p>
            </div>

            <table className="w-full text-start border-collapse">
                <thead>
                <tr className="bg-surface-variant/50 text-on-surface-muted text-xs uppercase tracking-wider">
                    <th className="p-4 text-start font-bold border-b border-outline">Phone Number</th>
                    <th className="p-4 text-start font-bold border-b border-outline">Role</th>
                    <th className="p-4 text-start font-bold border-b border-outline">Joined Date</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-outline text-sm">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-surface-variant/30">
                        <td className="p-4 font-bold" dir="ltr">{user.phone}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${user.role === 'ADMIN' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="p-4 text-on-surface-muted">
                            {new Date(user.joinedAt).toLocaleDateString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}