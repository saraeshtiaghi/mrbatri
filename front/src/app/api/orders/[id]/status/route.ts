import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    // Secure extraction
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;

    const backendRes = await fetch(`${BACKEND_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(body), // Forward the { status: "Shipped" } payload
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}