import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

export async function POST(request) {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || password !== adminPassword) {
        return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 });
    }

    const token = await createToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24時間
        path: '/',
    });

    return response;
}
