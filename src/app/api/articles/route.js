import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateSlug } from '@/lib/auth';

// 記事一覧取得（公開記事のみ）
export async function GET(request) {
    try {
        const sql = getDb();
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all'); // 管理者用：全記事

        let articles;
        if (all === 'true') {
            articles = await sql`
        SELECT id, title, excerpt, slug, published, created_at, updated_at
        FROM articles ORDER BY created_at DESC
      `;
        } else {
            articles = await sql`
        SELECT id, title, excerpt, slug, created_at
        FROM articles WHERE published = true ORDER BY created_at DESC
      `;
        }
        return NextResponse.json(articles);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'DBエラー' }, { status: 500 });
    }
}

// 記事新規作成
export async function POST(request) {
    try {
        const sql = getDb();
        const { title, content, excerpt, published } = await request.json();

        if (!title || !content) {
            return NextResponse.json({ error: 'タイトルと本文は必須です' }, { status: 400 });
        }

        const slug = generateSlug(title);
        const result = await sql`
      INSERT INTO articles (title, content, excerpt, slug, published)
      VALUES (${title}, ${content}, ${excerpt || ''}, ${slug}, ${published || false})
      RETURNING *
    `;
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'DBエラー' }, { status: 500 });
    }
}
