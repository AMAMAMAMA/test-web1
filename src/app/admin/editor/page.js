'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewEditorPage() {
    const router = useRouter();
    const [form, setForm] = useState({ title: '', content: '', excerpt: '', published: false });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) {
            setError('タイトルと本文は必須です');
            return;
        }
        setSaving(true);
        const res = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            router.push('/admin/dashboard');
        } else {
            const data = await res.json();
            setError(data.error || '保存に失敗しました');
            setSaving(false);
        }
    }

    return (
        <div className="container">
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/admin/dashboard" className="btn btn-secondary">← 戻る</Link>
                <h1 className="page-title" style={{ margin: 0 }}>新規記事作成</h1>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} className="editor-form">
                <div className="form-group">
                    <label className="form-label">タイトル *</label>
                    <input name="title" className="form-input" value={form.title} onChange={handleChange} placeholder="記事タイトル" required />
                </div>
                <div className="form-group">
                    <label className="form-label">抜粋（任意）</label>
                    <input name="excerpt" className="form-input" value={form.excerpt} onChange={handleChange} placeholder="記事の簡単な説明" />
                </div>
                <div className="form-group">
                    <label className="form-label">本文 * <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>（HTMLタグ使用可）</span></label>
                    <textarea name="content" className="form-textarea" value={form.content} onChange={handleChange} placeholder="<p>本文をここに入力...</p>" rows={16} required />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" id="published" name="published" checked={form.published} onChange={handleChange} style={{ width: '1.25rem', height: '1.25rem' }} />
                    <label htmlFor="published" className="form-label" style={{ margin: 0 }}>公開する</label>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? '保存中...' : '保存する'}
                    </button>
                    <Link href="/admin/dashboard" className="btn btn-secondary">キャンセル</Link>
                </div>
            </form>
        </div>
    );
}
