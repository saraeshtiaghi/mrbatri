"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useThemeStore } from '../store/useThemeStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import SearchBar from './SearchBar';

interface HeaderProps {
    lang: string;
    dict: {
        storeName: string;
        nav: {
            home: string;
            products: string;
            about: string;
        };
    };
}

export default function Header({ lang, dict }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();

    const { mode, toggleMode } = useThemeStore();
    const { items, openCart } = useCartStore();
    const { isAuthenticated, user, logout } = useAuthStore();

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const changeLanguage = (newLang: string) => {
        if (!pathname) return;
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        router.push(newPath);
    };

    const handleLogout = () => {
        logout();
        router.push(`/${lang}`);
    };

    const navLinks = [
        { name: dict.nav.home, href: `/${lang}` },
        { name: dict.nav.products, href: `/${lang}/store` },
        { name: dict.nav.about, href: `/${lang}/about` },
    ];

    return (
        <header className="bg-surface shadow-sm sticky top-0 z-10 border-b border-outline">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">

                {/* LOGO */}
                <Link href={`/${lang}`} className="text-2xl font-black tracking-tighter text-primary flex-shrink-0">
                    {dict.storeName}
                </Link>

                {/* MIDDLE: EXACTLY AS YOU WROTE IT */}
                <div className="flex-1 flex justify-center items-center gap-8">
                    <nav className="hidden lg:flex space-x-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-on-surface-muted hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <SearchBar lang={lang} />
                </div>

                {/* RIGHT CONTROLS */}
                <div className="flex items-center gap-4 text-sm flex-shrink-0 border-s border-outline ps-4">

                    {/* AUTH SECTION */}
                    <div className="hidden sm:flex items-center gap-4 min-w-[50px] justify-end">
                        {!mounted ? (
                            // Matches the width of "Sign In" perfectly
                            <div className="w-12 h-5 bg-surface-variant rounded animate-pulse"></div>
                        ) : isAuthenticated ? (
                            <>
                                {user?.role === 'ADMIN' && (
                                    <Link
                                        href={`/${lang}/admin`}
                                        className="px-3 py-1.5 bg-error/10 text-error font-bold rounded-lg hover:bg-error hover:text-white transition-colors text-xs uppercase tracking-wider"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-on-surface" dir="ltr">
                                        {user?.phone}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Link href={`/${lang}/my-orders`} className="text-xs font-medium text-primary hover:text-primary-variant transition-colors">
                                            My Orders
                                        </Link>
                                        <span className="text-outline text-xs">|</span>
                                        <button onClick={handleLogout} className="text-xs text-on-surface-muted hover:text-error transition-colors cursor-pointer">
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Link href={`/${lang}/login`} className="font-bold text-on-surface hover:text-primary transition-colors whitespace-nowrap">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Shopping Cart Icon with Badge */}
                    <div onClick={openCart} className="relative cursor-pointer hover:text-primary transition-colors text-on-surface">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {(mounted && totalItems > 0) && (
                            <span className="absolute -top-2 -right-2 bg-error text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </div>

                    {/* Theme Toggle - Locked width to prevent layout shift */}
                    <button onClick={toggleMode} className="p-1.5 rounded-lg bg-surface-variant border border-outline text-on-surface-muted hover:text-primary transition-colors cursor-pointer w-8 h-8 flex items-center justify-center">
                        {!mounted ? null : (mode === 'light' ? '🌙' : '☀️')}
                    </button>

                    {/* Language Switcher */}
                    <div className="flex gap-2">
                        <button onClick={() => changeLanguage('fa')} className={lang === 'fa' ? 'font-bold text-primary' : 'text-on-surface-muted'}>
                            فارسی
                        </button>
                        <span className="text-outline">|</span>
                        <button onClick={() => changeLanguage('en')} className={lang === 'en' ? 'font-bold text-primary' : 'text-on-surface-muted'}>
                            EN
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}