'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditorPage({ params }) {
    const router = useRouter();
    const [id, setId] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [published, setPublished] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function init() {
            const p = await params;
            const articleId = p?.id;
            setId(articleId);

            if (articleId) {
                setLoading(true);
                const res = await fetch(`/api/articles/${articleId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTitle(data.title);
                    setContent(data.content);
                    setExcerpt(data.excerpt || '');
                    setPublished(data.published);
                }
                setLoading(false);
            }
        }
        init();
    }, [params]);

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const body = { title, content, excerpt, published };
        const url = id ? `/api/articles/${id}` : '/api/articles';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setMessage('保存しました！');
            if (!id) {
                const data = await res.json();
                router.replace(`/admin/editor/${data.id}`);
            }
        } else {
            setMessage('エラーが発生しました');
        }
        setSaving(false);
    }

    if (loading) return <div className="loading">読み込み中...</div>;

    return (
        <div className="container" style={{ maxWidth: '860px' }}>
            <div className="toolbar" style={{ marginBottom: '1.5rem' }}>
                <Link href="/admin/dashboard" className="btn btn-secondary btn-sm">← ダッシュボード</Link>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {id ? '記事を編集' : '新規記事を作成'}
                </h1>
            </div>

            {message && (
                <div className={`alert ${message.includes('エラー') ? 'alert-error' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSave}>
                <div className="card" style={{ marginBottom: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">タイトル *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="記事のタイトル"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">抜粋（一覧に表示されるサマリー）</label>
                        <input
                            type="text"
                            className="form-input"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="記事の概要を1〜2文で"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">本文 *</label>
                        <textarea
                            className="form-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="記事の内容を書いてください..."
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={published}
                                onChange={(e) => setPublished(e.target.checked)}
                            />
                            公開する（チェックを外すと下書き保存）
                        </label>

                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? '保存中...' : (published ? '💾 公開・保存' : '💾 下書き保存')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
