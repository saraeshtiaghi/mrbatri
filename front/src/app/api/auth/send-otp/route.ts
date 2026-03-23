import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // 1. Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. Read the body sent by LoginForm.tsx
    const body = await request.json() as { phone: string };

    // 3. In a real app, trigger Kavenegar or Twilio here.
    console.log(`[MOCK SMS] OTP code is 12345 for phone: ${body.phone}`);

    // 4. Send success response
    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
}