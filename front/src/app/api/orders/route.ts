import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Helper to get the token securely from the HttpOnly cookie
async function getAuthHeader() {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function POST(request: Request) {
    const body = await request.json();
    const authHeader = await getAuthHeader();

    const backendRes = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader // Attach securely to Spring Boot
        },
        body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}

export async function GET(request: Request) {
    const authHeader = await getAuthHeader();

    const backendRes = await fetch(`${BACKEND_URL}/api/orders`, {
        headers: { ...authHeader }
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}