import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const backendRes = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json({ message: data.message || 'Invalid OTP' }, { status: backendRes.status });
        }

        // PRO UPGRADE: Set the HttpOnly Cookie
        const cookieStore = await cookies();
        cookieStore.set('jwt_token', data.token, {
            httpOnly: true, // XSS protection
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        // Return ONLY the user data, not the token
        return NextResponse.json({ user: data.user });

    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
    }
}