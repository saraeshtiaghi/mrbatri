import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
// Notice we added an extra dot because we moved one folder deeper!
import "../globals.css";
import ClientProvider from "@/components/ClientProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Let's update your SEO metadata to look professional!
export const metadata: Metadata = {
    title: "BATRISTORE | Premium Batteries",
    description: "Shop 100% genuine replacement batteries for your devices.",
};

export default async function RootLayout({
                                             children,
                                             params,
                                         }: Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>; // Next.js 15 treats params as a Promise
}>) {
    // 1. Await the parameters to get the current language from the URL (e.g., 'en' or 'fa')
    const {lang} = await params;

    // 2. Determine the text direction automatically!
    const dir = lang === "fa" ? "rtl" : "ltr";

    return (
        // 3. Inject the dynamic lang and dir directly into the HTML tag
        <html lang={lang} dir={dir} data-mode="light">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>
            {children}
        </ClientProvider>
        </body>
        </html>
    );
}