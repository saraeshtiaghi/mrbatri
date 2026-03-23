import Link from 'next/link';
import {getDictionary} from '@/lib/dictionaries';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';

// PRO TIP: This is a Server Component. It is async!
export default async function LandingPage({
                                              params,
                                          }: {
    params: Promise<{ lang: 'en' | 'fa' }>;
}) {
    const {lang} = await params;

    // 1. Load the dictionary on the server!
    const dict = await getDictionary(lang);

    return (
        <div
            className="min-h-screen bg-background text-on-background font-sans transition-colors duration-300 flex flex-col">
            {/* We will deal with these interactive client components in the next step */}
            <CartDrawer dict={dict} lang={lang}/>
            <Header dict={dict} lang={lang}/>

            <main className="flex-1">
                <section className="relative bg-surface border-b border-outline overflow-hidden">
                    <div
                        className="max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2 flex flex-col items-start z-10">
              <span className="text-secondary font-bold tracking-wider uppercase mb-4">
                100% Genuine Replacements
              </span>
                            <h1 className="text-5xl md:text-6xl font-black text-on-surface leading-tight mb-6">
                                Bring Your Devices <br/>
                                <span className="text-primary">Back to Life.</span>
                            </h1>
                            <p className="text-lg text-on-surface-muted mb-8 max-w-lg leading-relaxed">
                                Stop living tied to the charger. We offer premium, high-capacity batteries for all major
                                smartphone and laptop brands with a 1-year warranty.
                            </p>

                            <div className="flex gap-4 w-full md:w-auto">
                                <Link
                                    href={`/${lang}/store`}
                                    className="px-8 py-4 bg-primary hover:bg-primary-variant text-on-primary font-bold rounded-xl transition-colors shadow-lg text-center flex-1 md:flex-none"
                                >
                                    Shop Now
                                </Link>
                                <Link
                                    href={`/${lang}/store?category=Laptop`}
                                    className="px-8 py-4 bg-surface-variant hover:bg-outline text-on-surface font-bold rounded-xl transition-colors text-center border border-outline flex-1 md:flex-none"
                                >
                                    Laptops
                                </Link>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 relative flex justify-center">
                            <div
                                className="absolute inset-0 bg-primary/10 rounded-full blur-3xl transform scale-150"></div>
                            <img
                                src="https://placehold.co/600x400/e2e8f0/1e293b?text=High+Performance+Battery"
                                alt="Battery"
                                className="relative z-10 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Box 1 */}
                        <div className="bg-surface p-8 rounded-2xl border border-outline text-center shadow-sm">
                            <div
                                className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-on-surface mb-3">Fast Delivery</h3>
                            <p className="text-on-surface-muted">Same-day shipping on all orders placed before 2 PM.</p>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-surface p-8 rounded-2xl border border-outline text-center shadow-sm">
                            <div
                                className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-on-surface mb-3">Verified Quality</h3>
                            <p className="text-on-surface-muted">Every battery is tested for capacity and safety before
                                shipping.</p>
                        </div>

                        {/* Box 3 */}
                        <div className="bg-surface p-8 rounded-2xl border border-outline text-center shadow-sm">
                            <div
                                className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-on-surface mb-3">Secure Payment</h3>
                            <p className="text-on-surface-muted">Your transactions are protected by industry-leading
                                encryption.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}