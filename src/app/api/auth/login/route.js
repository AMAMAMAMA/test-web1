import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

export async function POST(request) {
    const { password } = await request.json();

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'パスワードが違います' }, { status: 401 });
    }

    const token = await createToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24h
    });
    return response;
}
