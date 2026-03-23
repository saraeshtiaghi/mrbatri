"use client";

import Image from 'next/image';
import type { Order } from '@/lib/db';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={onClose} />

            <div className="relative bg-surface border border-outline rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="sticky top-0 bg-surface border-b border-outline p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-2xl font-black text-on-surface">Order #{order.id}</h2>
                        <p className="text-sm text-on-surface-muted mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-on-surface-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Customer Details */}
                    <div className="bg-surface-variant rounded-xl p-5 border border-outline">
                        <h3 className="text-sm font-bold text-on-surface-muted uppercase tracking-wider mb-4">Customer & Shipping</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-on-surface-muted mb-1">Full Name</p>
                                <p className="font-bold text-on-surface">{order.fullName || 'Guest User'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-on-surface-muted mb-1">Phone Number</p>
                                <p className="font-bold text-on-surface" dir="ltr">{order.customerPhone}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-xs text-on-surface-muted mb-1">Delivery Address</p>
                                <p className="text-on-surface font-medium leading-relaxed">{order.shippingAddress || 'No address provided.'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-sm font-bold text-on-surface-muted uppercase tracking-wider mb-4">Purchased Items</h3>
                        <div className="border border-outline rounded-xl overflow-hidden divide-y divide-outline">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-surface hover:bg-surface-variant/50 transition-colors">
                                    {/* PRO TIP: Replaced <img> with Next.js <Image> */}
                                    <div className="relative w-16 h-16 bg-surface-variant rounded-lg p-2 shrink-0">
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-contain mix-blend-multiply p-1" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-on-surface">{item.name}</p>
                                        <p className="text-sm text-on-surface-muted">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-end">
                                        <p className="font-bold text-on-surface">${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-xs text-on-surface-muted">${item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex justify-end pt-4 border-t border-outline">
                        <div className="w-full sm:w-1/2 bg-surface-variant rounded-xl p-5 border border-outline">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-on-surface-muted">Subtotal</span>
                                <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-on-surface-muted">Shipping</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-outline">
                                <span className="font-black text-lg text-on-surface">Total</span>
                                <span className="font-black text-2xl text-primary">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}