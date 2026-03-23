"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // PRO TIP: Next.js hooks!
import { useAuthStore } from '../store/useAuthStore';

interface LoginFormProps {
    lang: string;
}

export default function LoginForm({ lang }: LoginFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams?.get('redirect');

    const { login, isAuthenticated, user } = useAuthStore();

    // Hydration check
    const [mounted, setMounted] = useState(false);

    // Local state to manage the UI
    const [step, setStep] = useState<1 | 2>(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    // PRO TIP: Smart Redirect if they are already logged in
    useEffect(() => {
        if (mounted && isAuthenticated) {
            if (user?.role === 'ADMIN') {
                router.replace(`/${lang}/admin`); // Replaces history so they can't click "back" to login
            } else {
                router.replace(`/${lang}/${redirectPath || 'store'}`);
            }
        }
    }, [mounted, isAuthenticated, user, router, lang, redirectPath]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (phone.length < 10) {
            setError('Please enter a valid phone number.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            if (!res.ok) throw new Error('Failed to send code.');
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (otp.length !== 5) {
            setError('OTP must be exactly 5 digits.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });

            if (!res.ok) throw new Error('Invalid OTP Code. Hint: Use 12345');

            const data = await res.json();

            // SUCCESS! Save to Zustand
            login(data.user, data.token);

            // Redirection logic is automatically handled by the useEffect above!
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Prevent rendering the form if we are about to redirect them away
    if (!mounted || isAuthenticated) return null;

    return (
        <div className="w-full max-w-md bg-surface border border-outline rounded-2xl shadow-lg p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === 1 && (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-on-surface mb-2">Welcome Back</h1>
                        <p className="text-sm text-on-surface-muted">Enter your phone number to log in or create an account.</p>
                    </div>

                    {error && <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-medium text-center">{error}</div>}

                    <div className="flex flex-col gap-2">
                        <label htmlFor="phone" className="text-sm font-bold text-on-surface">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            dir="ltr"
                            placeholder="0912 345 6789"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-3 bg-surface-variant border border-outline rounded-xl text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary hover:bg-primary-variant text-on-primary font-bold rounded-xl transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-14"
                    >
                        {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : 'Send Code'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-on-surface mb-2">Verify Phone</h1>
                        <p className="text-sm text-on-surface-muted">
                            We sent a 5-digit code to <span className="font-bold text-on-surface" dir="ltr">{phone}</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-primary hover:underline text-xs font-bold mt-2"
                        >
                            Edit phone number
                        </button>
                    </div>

                    {error && <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-medium text-center">{error}</div>}

                    <div className="flex flex-col gap-2">
                        <input
                            id="otp"
                            type="text"
                            dir="ltr"
                            maxLength={5}
                            placeholder="• • • • •"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full p-4 text-center text-3xl tracking-[1em] font-black bg-surface-variant border border-outline rounded-xl text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || otp.length !== 5}
                        className="w-full py-4 bg-primary hover:bg-primary-variant text-on-primary font-bold rounded-xl transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-14"
                    >
                        {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : 'Verify & Log In'}
                    </button>
                </form>
            )}
        </div>
    );
}