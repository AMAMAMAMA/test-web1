import './globals.css';

export const metadata = {
  title: 'My Blog',
  description: 'Next.js + Vercel CMS Blog',
};

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">✦ My Blog</a>
        <div className="navbar-links">
          <a href="/">記事一覧</a>
          <a href="/admin">管理画面</a>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} My Blog — Powered by Next.js &amp; Vercel</p>
        </footer>
      </body>
    </html>
  );
}
