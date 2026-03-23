import Link from 'next/link';
import { getCategories } from '@/lib/db';
import type { Product } from '@/lib/db';

interface SidebarProps {
    products: Product[];
    selectedCategory: string;
    lang: string;
    dict: any;
}

export default function Sidebar({ products, selectedCategory, lang, dict }: SidebarProps) {
    const categories = getCategories(products);
    const allCount = products.length;

    return (
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-surface p-5 rounded-xl shadow-sm border border-outline sticky top-24">
                <h2 className="font-bold mb-4 text-lg text-on-surface">
                    {dict.sidebar.categories}
                </h2>
                <ul className="space-y-3 text-sm">
                    {/* All Categories Link */}
                    <li>
                        <Link
                            href={`/${lang}/store`}
                            className={`flex justify-between items-center transition-colors ${
                                selectedCategory === 'all' ? 'font-black text-primary' : 'text-on-surface-muted hover:text-primary'
                            }`}
                        >
                            <span>{lang === 'fa' ? 'همه محصولات' : 'All Products'}</span>
                            <span className="py-0.5 px-2 rounded-full text-xs bg-surface-variant">{allCount}</span>
                        </Link>
                    </li>

                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <Link
                                href={`/${lang}/store?category=${cat.id}`}
                                className={`flex justify-between items-center transition-colors ${
                                    selectedCategory === cat.id ? 'font-black text-primary' : 'text-on-surface-muted hover:text-primary'
                                }`}
                            >
                                <span>{cat.name}</span>
                                <span className={`py-0.5 px-2 rounded-full text-xs ${
                                    selectedCategory === cat.id ? 'bg-primary text-on-primary' : 'bg-surface-variant'
                                }`}>
                                    {cat.count}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}