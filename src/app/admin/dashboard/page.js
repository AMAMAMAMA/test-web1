'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'short', day: 'numeric',
    });
}

export default function DashboardPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const router = useRouter();

    const fetchArticles = useCallback(async () => {
        const res = await fetch('/api/articles?all=true');
        if (res.ok) {
            setArticles(await res.json());
        }
        setLoading(false);
    }, []);

    useEffect(() => { fetchArticles(); }, [fetchArticles]);

    async function handleDelete(id) {
        if (!confirm('この記事を削除しますか？')) return;
        setDeleteId(id);
        await fetch(`/api/articles/${id}`, { method: 'DELETE' });
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setDeleteId(null);
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin');
    }

    return (
        <div className="container">
            <div className="page-header">
                <div className="toolbar">
                    <div>
                        <h1 className="page-title">記事管理</h1>
                        <p className="page-subtitle">{articles.length}件の記事</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link href="/admin/editor" className="btn btn-primary">+ 新規記事</Link>
                        <button onClick={handleLogout} className="btn btn-secondary">ログアウト</button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loading">読み込み中...</div>
            ) : articles.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">✏️</div>
                    <p className="empty-state-text">まだ記事がありません</p>
                    <Link href="/admin/editor" className="btn btn-primary">最初の記事を書く</Link>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>タイトル</th>
                                <th>ステータス</th>
                                <th>作成日</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td>
                                        <strong>{article.title}</strong>
                                        {article.excerpt && (
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                {article.excerpt.slice(0, 60)}...
                                            </p>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${article.published ? 'badge-published' : 'badge-draft'}`}>
                                            {article.published ? '公開' : '下書き'}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {formatDate(article.created_at)}
                                    </td>
                                    <td>
                                        <div className="actions">
                                            {article.published && (
                                                <Link href={`/article/${article.id}`} className="btn btn-secondary btn-sm" target="_blank">
                                                    表示
                                                </Link>
                                            )}
                                            <Link href={`/admin/editor/${article.id}`} className="btn btn-secondary btn-sm">
                                                編集
                                            </Link>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(article.id)}
                                                disabled={deleteId === article.id}
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
