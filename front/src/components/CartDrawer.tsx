"use client"; // REQUIRED: Because we use Zustand and DOM events

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // PRO TIP: Next.js router!
import { useCartStore } from '../store/useCartStore';

// We accept lang as a prop from the Server Component
interface CartDrawerProps {
    lang: string;
    // Note: You can add `dict` here later if you want to translate the cart text!
    dict?: any;
}

export default function CartDrawer({ lang }: CartDrawerProps) {
    const router = useRouter();
    const { isOpen, closeCart, items, updateQuantity, removeFromCart, clearCart } = useCartStore();

    // PRO TIP: Hydration Safety Check
    // We cannot render local storage data on the server.
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // If we are on the server OR the drawer is closed, render nothing.
    if (!mounted || !isOpen) return null;

    // Calculate the total price of all items in the cart
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 z-50 flex justify-end">

            {/* The Dark Overlay Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeCart}
            />

            {/* The Sliding Drawer Panel */}
            <div className="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b border-outline">
                    <h2 className="text-xl font-bold text-on-surface">Your Cart</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 text-on-surface-muted hover:text-error transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center text-on-surface-muted mt-10">
                            Your cart is currently empty.
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b border-outline pb-4">
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain bg-surface-variant rounded-md p-1" />

                                <div className="flex-1 flex flex-col">
                                    <h3 className="text-sm font-semibold text-on-surface">{item.name}</h3>
                                    <p className="text-primary font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center border border-outline rounded-md">
                                            <button
                                                onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)}
                                                className="px-2 py-1 text-on-surface-muted hover:bg-surface-variant transition-colors cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 text-sm text-on-surface font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-2 py-1 text-on-surface-muted hover:bg-surface-variant transition-colors cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs text-error hover:underline cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Drawer Footer (Total & Checkout) */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-outline bg-surface-variant">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-on-surface-muted font-medium">Subtotal</span>
                            <span className="text-xl font-bold text-on-surface">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => {
                                closeCart();
                                router.push(`/${lang}/checkout`); // PRO TIP: Using router.push()
                            }}
                            className="w-full bg-primary hover:bg-primary-variant text-on-primary py-3 rounded-lg font-bold transition-colors shadow-md cursor-pointer">
                            Proceed to Checkout
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full mt-3 text-sm text-on-surface-muted hover:text-on-surface transition-colors cursor-pointer"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}