import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

// POST /api/init - DBテーブルの初期化（初回のみ実行）
export async function POST() {
    try {
        await initDb();
        return NextResponse.json({ ok: true, message: 'Database initialized successfully' });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
