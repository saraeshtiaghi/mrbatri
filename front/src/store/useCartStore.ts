"use client";

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {Product} from "@/lib/db";

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean; // Controls the drawer UI
    openCart: () => void;
    closeCart: () => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            openCart: () => set({isOpen: true}),
            closeCart: () => set({isOpen: false}),

            addToCart: (product) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                        ),
                    });
                } else {
                    set({
                        items: [...currentItems, {...product, quantity: 1}],
                    });
                }
            },

            removeFromCart: (productId) => {
                set({items: get().items.filter((item) => item.id !== productId)});
            },

            updateQuantity: (productId, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.id === productId ? {...item, quantity} : item
                    ),
                });
            },

            clearCart: () => set({items: []}),
        }),
        {
            name: 'batristore-cart',
            // ONLY save the 'items' array to local storage, ignore 'isOpen'
            partialize: (state) => ({items: state.items}),
        }
    )
);