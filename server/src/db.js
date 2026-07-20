import pg from 'pg';
import { config, isProduction } from './config.js';

const { Pool } = pg;
export const db = new Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  ssl: isProduction && !config.DATABASE_URL.includes('@postgres:') ? { rejectUnauthorized: true } : false,
});

db.on('error', error => console.error('[database] conexão ociosa falhou', error));

export async function transaction(work) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
