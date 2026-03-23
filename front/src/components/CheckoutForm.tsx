"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/lib/axios'; // Use your configured axios!

export default function CheckoutForm({ lang, dict }: { lang: string; dict: any }) {
    const router = useRouter();
    const { items, clearCart } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();

    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!isAuthenticated) {
                router.replace(`/${lang}/login?redirect=checkout`);
            } else if (items.length === 0) {
                router.replace(`/${lang}/store`);
            }
        }
    }, [mounted, isAuthenticated, items, router, lang]);

    if (!mounted || !isAuthenticated || items.length === 0) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // SECURE PAYLOAD: No prices, no total amount! Just IDs and quantities.
        const orderPayload = {
            phone: user?.phone,
            fullName: fullName,
            address: address,
            items: items.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        try {
            // Your browser will automatically send the HttpOnly cookie to this Next.js route
            const res = await apiClient.post('/orders', orderPayload);

            if (res.status !== 200) throw new Error();

            clearCart();
            router.push(`/${lang}/my-orders`);
        } catch (err) {
            alert('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-surface p-6 rounded-2xl border border-outline">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm">1</span>
                        {dict.checkout.shipping}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold">{dict.checkout.fullName}</label>
                            <input
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="p-3 bg-surface-variant border border-outline rounded-xl outline-none focus:ring-2 focus:ring-primary"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold">Phone</label>
                            <input
                                disabled
                                value={user?.phone || ''}
                                className="p-3 bg-surface-variant border border-outline rounded-xl opacity-60"
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-sm font-bold">{dict.checkout.address}</label>
                            <textarea
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="p-3 bg-surface-variant border border-outline rounded-xl outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="bg-surface p-6 rounded-2xl border border-outline sticky top-24">
                    <h2 className="text-xl font-bold mb-6">{dict.checkout.summary}</h2>

                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                        {items.map(item => (
                            <div key={item.id} className="flex gap-4 items-center">
                                <div className="relative w-12 h-12 bg-surface-variant rounded-lg shrink-0">
                                    <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{item.name}</p>
                                    <p className="text-xs text-on-surface-muted">{item.quantity} x ${item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-outline pt-4 space-y-2">
                        <div className="flex justify-between text-sm text-on-surface-muted">
                            <span>{dict.checkout.items}</span>
                            <span>{items.length}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-primary">
                            <span>{dict.checkout.total}</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-8 py-4 bg-primary text-on-primary font-black rounded-xl hover:bg-primary-variant transition-colors shadow-lg disabled:opacity-50 cursor-pointer flex justify-center items-center"
                    >
                        {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : dict.checkout.placeOrder}
                    </button>
                </div>
            </div>
        </form>
    );
}