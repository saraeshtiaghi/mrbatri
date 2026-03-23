import {getDictionary} from '@/lib/dictionaries';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import SortDropdown from '@/components/SortDropdown';
import {Product} from '@/lib/db'; // Keep your interface! Just don't import mockProducts

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export default async function StorePage({params, searchParams}: {
    params: Promise<{ lang: 'en' | 'fa' }>;
    searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
    const {lang} = await params;
    const {q, category = 'all', sort = 'newest'} = await searchParams;
    const dict = await getDictionary(lang);

    const res = await fetch(`${BACKEND_URL}/api/products`, {cache: 'no-store'});
    let products: Product[] = res.ok ? await res.json() : [];

    // 1. Filtering Logic
    if (q) {
        const query = q.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        );
    }

    if (category !== 'all') {
        products = products.filter(p => p.category === category);
    }

    // 2. Sorting Logic
    products.sort((a, b) => {
        if (sort === 'price_asc') return a.price - b.price;
        if (sort === 'price_desc') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div
            className="min-h-screen bg-background text-on-background font-sans transition-colors duration-300 flex flex-col">
            <CartDrawer lang={lang} dict={dict}/>
            <Header lang={lang} dict={dict}/>

            <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 w-full">
                <Sidebar products={products} selectedCategory={category} lang={lang} dict={dict}/>

                <div className="flex-1">
                    <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-on-surface">
                                {category !== 'all' ? category : dict.nav.products}
                            </h1>
                            <p className="text-sm text-on-surface-muted">
                                {products.length} {lang === 'fa' ? 'محصول پیدا شد' : 'products found'}
                            </p>
                        </div>
                        <SortDropdown currentSort={sort} lang={lang}/>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    lang={lang}
                                    addToCartText={lang === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-surface rounded-2xl border border-outline border-dashed">
                            <p className="text-on-surface-muted">{lang === 'fa' ? 'محصولی یافت نشد' : 'No products match your criteria.'}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}