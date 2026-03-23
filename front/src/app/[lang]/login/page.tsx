import {getDictionary} from '@/lib/dictionaries';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import LoginForm from '@/components/LoginForm';
import {Metadata} from "next";

// SEO Metadata for the login page
export async function generateMetadata({params,}: {
    params: Promise<{ lang: 'en' | 'fa' }>;
}): Promise<Metadata> {
    const {lang} = await params;
    const dict = await getDictionary(lang);

    return {
        title: dict.seo.loginTitle,
        description: dict.seo.loginDesc,
    };
}

export default async function LoginPage({params,}: {
    params: Promise<{ lang: 'en' | 'fa' }>;
}) {
    const {lang} = await params;
    const dict = await getDictionary(lang);

    return (
        <div
            className="min-h-screen bg-background text-on-background font-sans transition-colors duration-300 flex flex-col">
            <CartDrawer lang={lang} dict={dict}/>
            <Header lang={lang} dict={dict}/>

            <main className="flex-1 flex items-center justify-center p-4 w-full">
                {/* We pass lang to the client component so it knows where to redirect! */}
                <LoginForm lang={lang}/>
            </main>
        </div>
    );
}