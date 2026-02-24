import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // /admin/dashboard 以下を保護（/admin ログインページは除く）
    if (pathname.startsWith('/admin/') || pathname === '/admin/dashboard') {
        const token = request.cookies.get('admin_token')?.value;
        if (!token || !(await verifyToken(token))) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/dashboard/:path*'],
};
