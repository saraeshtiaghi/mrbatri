"use client";

import { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { apiClient } from '@/lib/axios';
import { Product } from '@/lib/db';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    productToEdit: Product | null;
    onSuccess: () => void;
}

export default function ProductFormModal({ isOpen, onClose, productToEdit, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Mobile');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill the form if we are editing an existing product
    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setPrice(productToEdit.price.toString());
            setCategory(productToEdit.category);
            setDescription(productToEdit.description);
            setImageUrl(productToEdit.imageUrl);
        } else {
            // Reset form for a new product
            setName(''); setPrice(''); setCategory('Mobile');
            setDescription(''); setImageUrl('');
        }
        setError('');
    }, [productToEdit, isOpen]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError('');
        try {
            // 1. Compress
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1080,
                useWebWorker: true,
                fileType: 'image/webp'
            });

            // 2. Prepare Form Data
            const formData = new FormData();
            formData.append('file', compressedFile, compressedFile.name);

            // 3. Upload via Proxy
            const response = await apiClient.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' } // Axios needs this here
            });

            // 4. Save the MinIO URL
            setImageUrl(response.data.imageUrl);
        } catch (err) {
            setError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        const productData = {
            name,
            price: parseFloat(price),
            category,
            description,
            imageUrl
        };

        try {
            if (productToEdit) {
                // Update existing
                await apiClient.put(`/products/${productToEdit.id}`, productData);
            } else {
                // Create new
                await apiClient.post('/products', productData);
            }
            onSuccess(); // Refresh the table
            onClose();   // Close the modal
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save product.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-outline flex justify-between items-center">
                    <h2 className="text-xl font-black text-on-surface">
                        {productToEdit ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="text-on-surface-muted hover:text-error font-bold">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-bold">{error}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-on-surface">Product Name</label>
                            <input required value={name} onChange={e => setName(e.target.value)} className="p-3 bg-surface-variant rounded-xl border border-outline outline-none focus:border-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-on-surface">Price ($)</label>
                            <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="p-3 bg-surface-variant rounded-xl border border-outline outline-none focus:border-primary" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-on-surface">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="p-3 bg-surface-variant rounded-xl border border-outline outline-none focus:border-primary">
                                <option value="Mobile">Mobile</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Accessory">Accessory</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-bold text-on-surface">Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="p-2 text-sm text-on-surface-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                            {isUploading && <span className="text-xs text-primary font-bold animate-pulse">Compressing & Uploading...</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-on-surface">Description</label>
                        <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4} className="p-3 bg-surface-variant rounded-xl border border-outline outline-none focus:border-primary resize-none" />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-surface-variant hover:bg-outline font-bold rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={isSaving || isUploading || !imageUrl} className="px-6 py-3 bg-primary hover:bg-primary-variant text-on-primary font-bold rounded-xl transition-colors disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}