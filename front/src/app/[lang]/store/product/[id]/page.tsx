import {notFound} from 'next/navigation';
import Image from 'next/image'; // PRO TIP: Using the optimized Image component!
import Link from 'next/link';

import {getDictionary} from '@/lib/dictionaries';
import {Product} from '@/lib/db';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import AddToCartButton from '@/components/AddToCartButton';
import {Metadata} from "next";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Helper function to fetch single product
async function getProduct(id: string): Promise<Product | null> {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {cache: 'no-store'});
    if (!res.ok) return null;
    return res.json();
}

// 1. DYNAMIC SEO METADATA
export async function generateMetadata({params}: {
    params: Promise<{ lang: 'en' | 'fa'; id: string }>
}): Promise<Metadata> {
    const {id} = await params;
    const product = await getProduct(id);

    if (!product) {
        return {title: 'Product Not Found | BATRISTORE'};
    }

    return {
        title: `${product.name} | BATRISTORE`,
        description: product.description,
    };
}

// 2. THE SERVER COMPONENT
export default async function ProductDetailPage({params}: { params: Promise<{ lang: 'en' | 'fa'; id: string }> }) {
    const {lang, id} = await params;
    const dict = await getDictionary(lang);

    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div
            className="min-h-screen bg-background text-on-background font-sans transition-colors duration-300 flex flex-col">
            <CartDrawer lang={lang} dict={dict}/>
            <Header lang={lang} dict={dict}/>

            <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-16 w-full">

                {/* Breadcrumb Navigation */}
                <nav className="flex text-sm text-on-surface-muted mb-8">
                    <Link href={`/${lang}`} className="hover:text-primary transition-colors">{dict.nav.home}</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/${lang}/store`}
                          className="hover:text-primary transition-colors">{dict.nav.products}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-on-surface">{product.name}</span>
                </nav>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">

                    {/* Left Column: Product Image */}
                    <div
                        className="w-full md:w-1/2 flex justify-center items-center bg-surface-variant rounded-3xl p-8 border border-outline relative aspect-square">
                        {/* PRO TIP: Next.js <Image> requires either width/height OR 'fill'.
                            Using 'fill' and 'object-contain' makes it fully responsive!
                        */}
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-8 mix-blend-multiply"
                            priority // Tells Next.js to load this specific image immediately for better LCP!
                        />
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <div className="text-sm font-bold text-secondary uppercase tracking-widest mb-3">
                            {product.category}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-on-surface mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <p className="text-lg text-on-surface-muted mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="text-4xl font-black text-primary mb-8">
                            ${product.price.toFixed(2)}
                        </div>

                        <div className="w-full max-w-md">
                            <AddToCartButton
                                product={product}
                                text={lang === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}
                            />
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-outline pt-8">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-success/10 text-success rounded-full flex items-center justify-center shrink-0">
                                    ✓
                                </div>
                                <span className="text-sm font-bold text-on-surface">1 Year Warranty</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                                    📦
                                </div>
                                <span className="text-sm font-bold text-on-surface">Fast Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}