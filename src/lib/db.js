import { neon } from '@neondatabase/serverless';

export function getDb() {
    const sql = neon(process.env.DATABASE_URL);
    return sql;
}

export async function initDb() {
    const sql = getDb();
    await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      slug VARCHAR(255) UNIQUE NOT NULL,
      published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}
