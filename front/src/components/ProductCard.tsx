import Link from 'next/link';
import type { Product } from '../lib/db';
import AddToCartButton from './AddToCartButton'; // Import the client button

interface ProductCardProps {
    product: Product;
    lang: string;
    addToCartText: string;
}

// PRO TIP: No "use client" here! This is now a 100% Server Component.
export default function ProductCard({ product, lang, addToCartText }: ProductCardProps) {
    return (
        <div className="bg-surface border border-outline rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <Link href={`/${lang}/store/product/${product.id}`} className="block relative aspect-square bg-surface-variant p-6 group cursor-pointer">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            <div className="p-5 flex flex-col flex-1">
                <div className="text-xs font-bold text-on-surface-muted uppercase tracking-wider mb-2">
                    {product.category}
                </div>
                <Link href={`/${lang}/store/product/${product.id}`} className="text-lg font-bold text-on-surface hover:text-primary transition-colors line-clamp-2 mb-2">
                    {product.name}
                </Link>
                <div className="text-xl font-black text-primary mt-auto mb-4">
                    ${product.price.toFixed(2)}
                </div>

                {/* The isolated interactive piece */}
                <AddToCartButton product={product} text={addToCartText} />
            </div>
        </div>
    );
}