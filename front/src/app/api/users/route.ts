import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/db';

export async function GET() {
    // Simulate a tiny delay for that "pro" feel
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json(mockUsers);
}