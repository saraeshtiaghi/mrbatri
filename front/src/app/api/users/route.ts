import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt_token')?.value;

    const backendRes = await fetch(`${BACKEND_URL}/api/users`, {
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
}