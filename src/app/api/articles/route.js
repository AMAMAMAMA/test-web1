import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateSlug } from '@/lib/auth';

// GET /api/articles - 全記事一覧（管理画面用）
export async function GET() {
    try {
        const sql = getDb();
        const articles = await sql`
            SELECT id, title, excerpt, slug, published, created_at, updated_at
            FROM articles ORDER BY created_at DESC
        `;
        return NextResponse.json(articles);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/articles - 新規記事作成
export async function POST(request) {
    try {
        const { title, content, excerpt, published } = await request.json();
        const sql = getDb();
        const slug = generateSlug(title);
        const result = await sql`
            INSERT INTO articles (title, content, excerpt, slug, published)
            VALUES (${title}, ${content}, ${excerpt || ''}, ${slug}, ${published || false})
            RETURNING *
        `;
        return NextResponse.json(result[0], { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
