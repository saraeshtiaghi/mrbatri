"use client";

import { useState, useEffect } from "react";
import type { Order, OrderStatus } from '@/lib/db';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import { apiClient } from "@/lib/axios"; // <-- Import apiClient

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            // Using apiClient
            const response = await apiClient.get('/orders');
            setOrders(response.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
        setIsUpdating(id);
        try {
            // Using apiClient
            await apiClient.put(`/orders/${id}/status`, { status: newStatus });

            // Instantly update local UI without a full refetch!
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Failed to update order status');
        } finally {
            setIsUpdating(null);
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            case 'Processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'Shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
            case 'Delivered': return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'Cancelled': return 'bg-error/10 text-error border-error/20';
            default: return 'bg-surface-variant text-on-surface-muted';
        }
    };

    if (isLoading) return <div className="p-8 text-on-surface animate-pulse">Loading orders...</div>;
    if (error) return <div className="p-8 text-error">Error loading orders.</div>;

    return (
        <div className="bg-surface border border-outline rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-outline">
                <h2 className="text-2xl font-black text-on-surface">Orders</h2>
                <p className="text-sm text-on-surface-muted">Manage customer purchases and shipments</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                    <thead>
                    <tr className="bg-surface-variant/50 text-on-surface-muted text-xs uppercase tracking-wider">
                        <th className="p-4 text-start font-bold border-b border-outline">Order ID</th>
                        <th className="p-4 text-start font-bold border-b border-outline">Phone</th>
                        <th className="p-4 text-start font-bold border-b border-outline">Date</th>
                        <th className="p-4 text-start font-bold border-b border-outline">Total</th>
                        <th className="p-4 text-start font-bold border-b border-outline">Status</th>
                        <th className="p-4 text-end font-bold border-b border-outline">Update Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-outline text-sm">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface-variant/30 transition-colors">
                            <td className="p-4 font-bold text-on-surface">#{order.id.substring(0, 8)}...</td>
                            <td className="p-4 font-medium" dir="ltr">{order.customerPhone}</td>
                            <td className="p-4 text-on-surface-muted">{new Date(order.createdAt).toLocaleString()}</td>
                            <td className="p-4 font-bold text-on-surface">${order.totalAmount.toFixed(2)}</td>
                            <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                            </td>
                            <td className="p-4 text-end flex justify-end gap-2 items-center">
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                >
                                    View
                                </button>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    disabled={isUpdating === order.id}
                                    className="p-2 text-sm bg-surface border border-outline rounded-lg text-on-surface focus:ring-2 focus:ring-primary outline-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-on-surface-muted">No orders found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <OrderDetailsModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} />
        </div>
    );
}