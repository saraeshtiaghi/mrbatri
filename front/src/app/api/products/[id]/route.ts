import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

async function getAuthHeader() {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const authHeader = await getAuthHeader();

    const backendRes = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader
        },
        body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const authHeader = await getAuthHeader();

    const backendRes = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
            ...authHeader
        }
    });

    if (backendRes.status === 204) {
        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Failed to delete' }, { status: backendRes.status });
}