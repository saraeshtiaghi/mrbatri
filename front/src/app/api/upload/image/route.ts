import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function POST(request: Request) {
    try {
        // 1. Extract the FormData from the incoming React request
        const formData = await request.formData();

        // 2. Grab the JWT token attached by the Axios Interceptor
        const authHeader = request.headers.get('Authorization');

        // 3. Forward to Spring Boot
        const backendRes = await fetch(`${BACKEND_URL}/api/upload/image`, {
            method: 'POST',
            headers: {
                // DO NOT set Content-Type here! Let fetch handle the multipart boundary.
                ...(authHeader && { 'Authorization': authHeader })
            },
            body: formData,
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return NextResponse.json(
                { message: data.message || 'Failed to upload image to backend' },
                { status: backendRes.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Upload proxy error:", error);
        return NextResponse.json(
            { message: 'Internal Server Error during upload.' },
            { status: 500 }
        );
    }
}