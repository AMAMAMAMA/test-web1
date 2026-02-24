import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getArticle(id) {
    try {
        const { getDb } = await import('@/lib/db');
        const sql = getDb();
        const result = await sql`SELECT * FROM articles WHERE id = ${id} AND published = true`;
        return result[0] || null;
    } catch {
        return null;
    }
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

export default async function ArticlePage({ params }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    return (
        <div className="article-container">
            <Link href="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
                ← 一覧に戻る
            </Link>

            <article>
                <header className="article-header">
                    <h1 className="article-title">{article.title}</h1>
                    <p className="article-meta">{formatDate(article.created_at)}</p>
                </header>
                <div className="article-content">{article.content}</div>
            </article>
        </div>
    );
}
