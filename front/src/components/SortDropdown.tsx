"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SortDropdown({ currentSort, lang }: { currentSort: string, lang: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set('sort', value);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-surface border border-outline text-on-surface py-2 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer w-full sm:w-auto"
        >
            <option value="newest">{lang === 'fa' ? 'جدیدترین' : 'Sort by: Newest'}</option>
            <option value="price_asc">{lang === 'fa' ? 'ارزان‌ترین' : 'Price: Low to High'}</option>
            <option value="price_desc">{lang === 'fa' ? 'گران‌ترین' : 'Price: High to Low'}</option>
        </select>
    );
}