import { NextResponse } from 'next/server';
import { mockProducts } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const index = mockProducts.findIndex(p => p.id === Number(id));

    if (index === -1) return NextResponse.json({ message: 'Not Found' }, { status: 404 });

    // Update the mock database
    mockProducts[index] = { ...mockProducts[index], ...body };
    return NextResponse.json(mockProducts[index]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const index = mockProducts.findIndex(p => p.id === Number(id));

    if (index === -1) return NextResponse.json({ message: 'Not Found' }, { status: 404 });

    mockProducts.splice(index, 1);
    return NextResponse.json({ message: 'Deleted' });
}