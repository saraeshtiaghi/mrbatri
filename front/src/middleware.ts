import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if the user is trying to access /admin
    if (pathname.includes('/admin')) {
        // PRO TIP: In a real app, you would check a cookie here for the user role.
        // For now, we'll let the client-side state handle the logic, but this is where
        // you would stop the request on the server!
    }

    return NextResponse.next();
}