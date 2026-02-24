import Link from 'next/link';

async function getArticles() {
  try {
    const { getDb } = await import('@/lib/db');
    const sql = getDb();
    const articles = await sql`
      SELECT id, title, excerpt, slug, created_at
      FROM articles WHERE published = true ORDER BY created_at DESC
    `;
    return articles;
  } catch {
    return [];
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default async function HomePage() {
  const articles = await getArticles();

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">最新の記事</h1>
        <p className="page-subtitle">
          {articles.length > 0 ? `${articles.length}件の記事` : 'まだ記事がありません'}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p className="empty-state-text">まだ公開された記事がありません</p>
          <Link href="/admin" className="btn btn-primary">管理画面から記事を作成する</Link>
        </div>
      ) : (
        <div className="card-grid">
          {articles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`} className="card-link">
              <article className="card">
                <h2 className="card-title">{article.title}</h2>
                {article.excerpt && (
                  <p className="card-excerpt">{article.excerpt}</p>
                )}
                <p className="card-meta">{formatDate(article.created_at)}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
