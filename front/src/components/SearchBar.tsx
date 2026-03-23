"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFilterStore } from '../store/useFilterStore';

export default function SearchBar({ lang }: { lang: string }) {
    const router = useRouter();
    const pathname = usePathname();

    const { searchQuery, setSearchQuery } = useFilterStore();

    // We start with an empty string to prevent any hydration mismatch
    const [localValue, setLocalValue] = useState('');

    // Sync with Zustand safely after mount
    useEffect(() => {
        setLocalValue(searchQuery);
    }, [searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localValue !== searchQuery) {
                setSearchQuery(localValue);

                const params = new URLSearchParams();
                if (localValue.trim()) {
                    params.set('q', localValue);
                }

                if (pathname?.includes('/store')) {
                    // CASE B: Already on store, just update the URL query
                    // Use 'replace' to avoid cluttering the browser history with every keystroke
                    router.replace(`${pathname}?${params.toString()}`);
                } else if (localValue.trim() !== '') {
                    // CASE A: On another page, jump to store
                    router.push(`/${lang}/store?${params.toString()}`);
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localValue, searchQuery, setSearchQuery, router, lang, pathname]);

    return (
        <div className="relative w-full max-w-sm hidden md:block">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-on-surface-muted">
                {/* YOUR EXACT SEARCH ICON IS RESTORED HERE */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={lang === 'fa' ? 'جستجوی باتری...' : 'Search batteries...'}
                className="block w-full p-2 ps-10 text-sm bg-surface-variant border border-outline rounded-full text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            />
        </div>
    );
}