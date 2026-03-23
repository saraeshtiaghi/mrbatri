"use client";

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/db';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit: Product | null;
    onSuccess: () => void; // Added to trigger a table refresh
}

export default function ProductFormModal({ isOpen, onClose, productToEdit, onSuccess }: ProductFormModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [category, setCategory] = useState('Mobile');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setPrice(productToEdit.price);
            setCategory(productToEdit.category);
            setImageUrl(productToEdit.imageUrl);
            setDescription(productToEdit.description);
        } else {
            setName('');
            setPrice('');
            setCategory('Mobile');
            setImageUrl('');
            setDescription('');
        }
    }, [productToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);

        const payload = {
            name,
            price: Number(price),
            category,
            imageUrl,
            description,
        };

        try {
            let res;
            if (productToEdit) {
                // UPDATE (PUT)
                res = await fetch(`/api/products/${productToEdit.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                // CREATE (POST)
                res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) throw new Error('Failed to save product');

            onSuccess(); // Refresh the table
            onClose();   // Close the modal
        } catch (err) {
            alert('An error occurred while saving the product.');
        } finally {
            setIsPending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-surface border border-outline rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-on-surface">
                        {productToEdit ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="text-on-surface-muted hover:text-error transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-on-surface mb-1">Product Name</label>
                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)}
                               className="w-full p-3 bg-surface-variant border border-outline rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-on-surface mb-1">Price ($)</label>
                            <input required type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} dir="ltr"
                                   className="w-full p-3 bg-surface-variant border border-outline rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-on-surface mb-1">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 bg-surface-variant border border-outline rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                            >
                                <option value="Mobile">Mobile</option>
                                <option value="Laptop">Laptop</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-on-surface mb-1">Image URL</label>
                        <input required type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} dir="ltr" placeholder="https://..."
                               className="w-full p-3 bg-surface-variant border border-outline rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-on-surface mb-1">Description</label>
                        <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                                  className="w-full p-3 bg-surface-variant border border-outline rounded-xl text-on-surface focus:ring-2 focus:ring-primary outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline">
                        <button type="button" onClick={onClose} disabled={isPending}
                                className="px-6 py-3 text-on-surface-muted hover:bg-surface-variant font-bold rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={isPending}
                                className="px-6 py-3 bg-primary hover:bg-primary-variant text-on-primary font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                        >
                            {isPending && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                            {productToEdit ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}