import { NextResponse } from 'next/server';
import { mockProducts } from '@/lib/db';

// PRO TIP: In Next.js, you name the function after the HTTP method (GET, POST, PUT, DELETE)
export async function GET(request: Request) {
    // 1. Simulate network delay (just like we did in MSW)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 2. Extract the URL and search parameters
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase();

    let results = mockProducts;

    // 3. Handle the search logic
    if (q) {
        results = results.filter((p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    }

    // 4. Return the data as a JSON response
    return NextResponse.json(results);
}

export async function POST(request: Request) {
    const body = await request.json();

    const newProduct = {
        id: Math.floor(Math.random() * 10000), // Generate random ID
        name: body.name,
        price: body.price,
        category: body.category,
        imageUrl: body.imageUrl,
        description: body.description,
        createdAt: new Date().toISOString(),
    };

    mockProducts.unshift(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
}