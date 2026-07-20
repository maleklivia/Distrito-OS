import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import pg from 'pg';

const { Client } = pg;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL é obrigatório');
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const files = (await readdir('/database/migrations')).filter(name => name.endsWith('.sql')).sort();
  for (const file of files) {
    const exists = await client.query('SELECT 1 FROM schema_migrations WHERE version = $1', [file]);
    if (exists.rowCount) continue;
    await client.query(await readFile(`/database/migrations/${file}`, 'utf8'));
    await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
    console.log(`Aplicada: ${file}`);
  }
} finally {
  await client.end();
}
