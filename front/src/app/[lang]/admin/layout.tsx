import {getDictionary} from '@/lib/dictionaries';
import Header from '@/components/Header';
import AdminSidebar from '@/components/AdminSidebar';
import React from "react";

export default async function AdminLayout({children, params,}: {
    children: React.ReactNode;
    params: Promise<{ lang: 'en' | 'fa' }>;
}) {
    const {lang} = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-background text-on-background font-sans flex flex-col">
            <Header lang={lang} dict={dict}/>

            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar lang={lang}/>
                <main className="flex-1 overflow-y-auto bg-surface-variant/30 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}