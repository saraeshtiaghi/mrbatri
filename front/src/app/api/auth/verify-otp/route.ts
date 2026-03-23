import { NextResponse } from 'next/server';

// Your Spring Boot backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
    try {
        const body = await request.json() as { phone: string; otp: string };

        // 1. Forward the request securely to Spring Boot
        const backendRes = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        // 2. Parse the response from Kotlin
        const data = await backendRes.json();

        // 3. Handle errors (e.g., wrong OTP)
        if (!backendRes.ok) {
            return NextResponse.json(
                { message: data.message || 'Invalid OTP Code' },
                { status: backendRes.status }
            );
        }

        // 4. Success! We pass the token and user data back to the React frontend.
        // NOTE: Later, we will upgrade this to set an HttpOnly cookie instead of sending the token!
        return NextResponse.json({
            token: data.token,
            user: data.user
        });

    } catch (error) {
        console.error("Backend connection error:", error);
        return NextResponse.json(
            { message: 'Internal Server Error. Could not connect to backend.' },
            { status: 500 }
        );
    }
}