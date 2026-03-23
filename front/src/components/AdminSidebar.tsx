"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar({ lang }: { lang: string }) {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: `/${lang}/admin`, icon: '📊' },
        { name: 'Products', href: `/${lang}/admin/products`, icon: '🔋' },
        { name: 'Orders', href: `/${lang}/admin/orders`, icon: '🛒' },
        { name: 'Users', href: `/${lang}/admin/users`, icon: '👥' },
    ];

    return (
        <aside className="w-64 bg-surface border-e border-outline hidden md:block shrink-0">
            <nav className="p-4 space-y-2 mt-4">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${
                                isActive
                                    ? 'bg-primary text-on-primary shadow-md'
                                    : 'text-on-surface-muted hover:bg-surface-variant'
                            }`}
                        >
                            <span>{link.icon}</span>
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}