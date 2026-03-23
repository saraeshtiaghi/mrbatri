import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

async function getAuthHeader() {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const backendRes = await fetch(`${BACKEND_URL}/api/products?${searchParams.toString()}`);
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(request: Request) {
    const body = await request.json();
    const authHeader = await getAuthHeader(); // Secure extraction

    const backendRes = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader
        },
        body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}