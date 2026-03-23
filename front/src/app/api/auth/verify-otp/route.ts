import {NextResponse} from 'next/server';
import {getOrCreateUser} from "@/lib/db";

export async function POST(request: Request) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const body = await request.json() as { phone: string; otp: string };

    // Hard-code '12345' as the correct OTP
    if (body.otp === '12345') {
        const user = getOrCreateUser(body.phone);

        return NextResponse.json({
            token: 'mock-jwt-token-xyz-789',
            user: user
        });
    }

    // If OTP is wrong, return a 401 Unauthorized error
    return NextResponse.json(
        {message: 'Invalid OTP Code'},
        {status: 401}
    );
}