"use client";

import {useState, useEffect} from "react";
import Image from "next/image";
import type {Product} from '@/lib/db';
import ProductFormModal from '@/components/ProductFormModal';
import {apiClient} from '@/lib/axios'; // <-- Import your Axios client!

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            // Use apiClient instead of native fetch
            const response = await apiClient.get('/products');
            setProducts(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateNew = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

        setIsDeleting(id);
        try {
            // Use apiClient to ensure the Admin JWT token is sent!
            await apiClient.delete(`/products/${id}`);
            fetchProducts();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete product');
        } finally {
            setIsDeleting(null);
        }
    };

    if (isLoading) return <div className="p-8 text-on-surface animate-pulse">Loading products...</div>;
    if (error) return <div className="p-8 text-error">Error loading products.</div>;

    return (
        <div
            className="bg-surface border border-outline rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
                className="p-6 border-b border-outline flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-on-surface">Products</h2>
                    <p className="text-sm text-on-surface-muted">Manage your battery inventory</p>
                </div>

                <button
                    onClick={handleCreateNew}
                    className="px-6 py-3 bg-primary hover:bg-primary-variant text-on-primary font-bold rounded-xl transition-colors shadow-md flex items-center gap-2 text-sm cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Add New Product
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-start border-collapse">
                    <thead>
                    <tr className="bg-surface-variant/50 text-on-surface-muted text-xs uppercase tracking-wider">
                        <th className="p-4 text-start font-bold border-b border-outline">Image</th>
                        <th className="p-4 text-start font-bold border-b border-outline">Name & Category</th>
                        <th className="p-4 text-start font-bold border-b border-outline">Price</th>
                        <th className="p-4 text-start font-bold border-b border-outline">Stock</th>
                        <th className="p-4 text-start font-bold border-b border-outline">Date Added</th>
                        <th className="p-4 text-end font-bold border-b border-outline">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-outline text-sm">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-surface-variant/30 transition-colors">
                            <td className="p-4">
                                <div className="relative w-16 h-16 bg-surface-variant rounded-xl p-2 shrink-0">
                                    {/* PRO TIP: unoptimized lets admins paste any URL without crashing Next.js */}
                                    <Image src={product.imageUrl} alt={product.name} fill unoptimized
                                           className="object-contain mix-blend-multiply p-1"/>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="font-bold text-on-surface text-base">{product.name}</div>
                                <div className="text-xs font-bold text-primary uppercase mt-1">{product.category}</div>
                            </td>
                            <td className="p-4 font-black text-on-surface text-base">
                                ${product.price.toFixed(2)}
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                                    product.stock === 0
                                        ? 'bg-error/10 text-error'
                                        : product.stock <= 5
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-green-100 text-green-700'
                                }`}>
                                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                                </span>
                            </td>
                            <td className="p-4 text-on-surface-muted font-medium">
                                {new Date(product.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-end">
                                <div className="flex justify-end gap-4 items-center">
                                    <button onClick={() => handleEdit(product)}
                                            className="text-primary hover:text-primary-variant font-black transition-colors cursor-pointer">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        disabled={isDeleting === product.id}
                                        className="text-error hover:text-red-700 font-black transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {isDeleting === product.id ? '...' : 'Delete'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-on-surface-muted font-bold">
                                No products found. Click "Add New Product" to create one.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productToEdit={editingProduct}
                onSuccess={fetchProducts} // Pass the refresh function down!
            />
        </div>
    );
}