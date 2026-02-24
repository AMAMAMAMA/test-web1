'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            router.push('/admin/dashboard');
        } else {
            const data = await res.json();
            setError(data.error || 'ログインに失敗しました');
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔐</div>
                    <h1 className="login-title">管理画面ログイン</h1>
                    <p className="login-subtitle">管理者パスワードを入力してください</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">パスワード</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                        disabled={loading}
                    >
                        {loading ? 'ログイン中...' : 'ログイン'}
                    </button>
                </form>
            </div>
        </div>
    );
}
