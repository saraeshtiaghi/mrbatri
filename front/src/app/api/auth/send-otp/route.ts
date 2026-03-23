import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
    try {
        const body = await request.json() as { phone: string };

        const backendRes = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json(
                { message: data.message || 'Failed to send OTP' },
                { status: backendRes.status }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error("Backend connection error:", error);
        return NextResponse.json(
            { message: 'Internal Server Error. Could not connect to backend.' },
            { status: 500 }
        );
    }
}