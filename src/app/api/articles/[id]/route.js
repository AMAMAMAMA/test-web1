import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// 単一記事取得
export async function GET(request, { params }) {
    try {
        const sql = getDb();
        const { id } = await params;
        const result = await sql`SELECT * FROM articles WHERE id = ${id}`;

        if (result.length === 0) {
            return NextResponse.json({ error: '記事が見つかりません' }, { status: 404 });
        }
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'DBエラー' }, { status: 500 });
    }
}

// 記事更新
export async function PUT(request, { params }) {
    try {
        const sql = getDb();
        const { id } = await params;
        const { title, content, excerpt, published } = await request.json();

        const result = await sql`
      UPDATE articles
      SET title = ${title}, content = ${content}, excerpt = ${excerpt || ''},
          published = ${published}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

        if (result.length === 0) {
            return NextResponse.json({ error: '記事が見つかりません' }, { status: 404 });
        }
        return NextResponse.json(result[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'DBエラー' }, { status: 500 });
    }
}

// 記事削除
export async function DELETE(request, { params }) {
    try {
        const sql = getDb();
        const { id } = await params;
        await sql`DELETE FROM articles WHERE id = ${id}`;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'DBエラー' }, { status: 500 });
    }
}
