"use client";

import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/lib/db';
import { useState, useEffect } from 'react';

export default function AddToCartButton({ product, text }: { product: Product, text: string }) {
    const { items, addToCart, updateQuantity, removeFromCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Find if this specific product is already in our Zustand cart
    const cartItem = items.find((item) => item.id === product.id);

    if (!mounted) {
        return <div className="h-12 w-full bg-surface-variant animate-pulse rounded-xl" />;
    }

    if (product.stock === 0) {
        return (
            <div className="w-full h-12 flex items-center justify-center bg-surface-variant text-on-surface-muted font-bold rounded-xl cursor-not-allowed">
                Out of Stock
            </div>
        );
    }

    if (cartItem) {
        const atStockLimit = cartItem.quantity >= product.stock;
        return (
            <div className="flex items-center justify-between w-full h-12 bg-primary rounded-xl px-2 text-on-primary shadow-md">
                <button
                    onClick={() => {
                        if (!atStockLimit) updateQuantity(product.id, cartItem.quantity + 1);
                    }}
                    disabled={atStockLimit}
                    className="w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-white/10 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    +
                </button>

                <span className="font-black text-lg">{cartItem.quantity}</span>

                <button
                    onClick={() => {
                        if (cartItem.quantity > 1) {
                            updateQuantity(product.id, cartItem.quantity - 1);
                        } else {
                            removeFromCart(product.id);
                        }
                    }}
                    className="w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                    −
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => addToCart(product)}
            className="w-full h-12 bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all duration-300 cursor-pointer active:scale-95"
        >
            {text}
        </button>
    );
}