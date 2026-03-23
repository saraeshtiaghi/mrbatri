import {NextResponse} from 'next/server';
import {mockOrders} from '@/lib/db';

export async function PUT(request: Request, {params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const {status} = await request.json();

    const order = mockOrders.find(o => o.id === id);

    if (!order) {
        return NextResponse.json({message: 'Order not found'}, {status: 404});
    }

    // Update the status in our "real" mock database
    order.status = status;

    console.log(`[ADMIN] Order #${id} updated to: ${status}`);

    return NextResponse.json(order);
}