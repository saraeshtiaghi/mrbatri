import {NextResponse} from 'next/server';
import {mockOrders, Order, OrderItem} from '@/lib/db';

export async function GET() {
    return NextResponse.json(mockOrders);
}

export async function POST(request: Request) {
    const body = await request.json();

    const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerPhone: body.phone,
        fullName: body.fullName,
        shippingAddress: body.address,
        createdAt: new Date().toLocaleDateString(),
        status: 'Pending',
        totalAmount: body.total,
        items: body.items
    };

    mockOrders.unshift(newOrder); // Add to the top of the list
    return NextResponse.json(newOrder);
}