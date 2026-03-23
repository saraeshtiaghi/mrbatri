import {getDictionary} from '@/lib/dictionaries';
import Header from '@/components/Header';
import CheckoutForm from '@/components/CheckoutForm';
import {Metadata} from "next";

export async function generateMetadata({params}: { params: Promise<{ lang: 'en' | 'fa' }> }): Promise<Metadata> {
    const {lang} = await params;
    const dict = await getDictionary(lang);
    return {
        title: `${dict.checkout.title} | BATRISTORE`,
    };
}

export default async function CheckoutPage({params}: { params: Promise<{ lang: 'en' | 'fa' }> }) {
    const {lang} = await params;
    const dict = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-background text-on-background font-sans transition-colors duration-300">
            <Header lang={lang} dict={dict}/>

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
                <h1 className="text-3xl font-black mb-8">{dict.checkout.title}</h1>

                {/* Isolated Client Logic */}
                <CheckoutForm lang={lang} dict={dict}/>
            </main>
        </div>
    );
}