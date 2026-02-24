import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function POST() {
    try {
        await initDb();
        return NextResponse.json({ success: true, message: 'DBテーブルを初期化しました' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
