'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/articles')
            .then(r => r.json())
            .then(data => { setArticles(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    async function handleDelete(id) {
        if (!confirm('この記事を削除しますか？')) return;
        await fetch(`/api/articles/${id}`, { method: 'DELETE' });
        setArticles(prev => prev.filter(a => a.id !== id));
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin');
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('ja-JP');
    }

    return (
        <div className="container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 className="page-title">記事管理</h1>
                    <p className="page-subtitle">{articles.length}件の記事</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link href="/admin/editor" className="btn btn-primary">＋ 新規作成</Link>
                    <button onClick={handleLogout} className="btn btn-secondary">ログアウト</button>
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>読み込み中...</p>
            ) : articles.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <p className="empty-state-text">まだ記事がありません</p>
                    <Link href="/admin/editor" className="btn btn-primary">最初の記事を作成する</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {articles.map(article => (
                        <div key={article.id} className="article-row">
                            <div className="article-row-info">
                                <span className={`badge ${article.published ? 'badge-published' : 'badge-draft'}`}>
                                    {article.published ? '公開' : '下書き'}
                                </span>
                                <span className="article-row-title">{article.title}</span>
                                <span className="article-row-date">{formatDate(article.created_at)}</span>
                            </div>
                            <div className="article-row-actions">
                                <Link href={`/admin/editor/${article.id}`} className="btn btn-secondary btn-sm">編集</Link>
                                <button onClick={() => handleDelete(article.id)} className="btn btn-danger btn-sm">削除</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
