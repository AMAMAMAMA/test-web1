import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/articles/[id]
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const sql = getDb();
        const result = await sql`SELECT * FROM articles WHERE id = ${id}`;
        if (result.length === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json(result[0]);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PUT /api/articles/[id]
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const { title, content, excerpt, published } = await request.json();
        const sql = getDb();
        const result = await sql`
            UPDATE articles
            SET title = ${title}, content = ${content},
                excerpt = ${excerpt || ''}, published = ${published || false},
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json(result[0]);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE /api/articles/[id]
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        const sql = getDb();
        await sql`DELETE FROM articles WHERE id = ${id}`;
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
