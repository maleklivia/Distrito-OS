import 'dotenv/config';
import argon2 from 'argon2';
import pg from 'pg';

const required = ['DATABASE_URL','ADMIN_NAME','ADMIN_EMAIL','ADMIN_PASSWORD'];
for (const key of required) if (!process.env[key]) throw new Error(`${key} é obrigatório`);
if (process.env.ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD deve ter pelo menos 12 caracteres');

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const role = await client.query("SELECT id FROM roles WHERE name = 'admin'");
  if (!role.rowCount) throw new Error('Execute as migrations antes de criar o administrador');
  const passwordHash = await argon2.hash(process.env.ADMIN_PASSWORD, { type: argon2.argon2id });
  await client.query(`
    INSERT INTO users (role_id,name,email,password_hash)
    VALUES ($1,$2,$3,$4)
    ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name,password_hash=EXCLUDED.password_hash,active=true,updated_at=now()
  `, [role.rows[0].id,process.env.ADMIN_NAME,process.env.ADMIN_EMAIL.trim().toLowerCase(),passwordHash]);
  console.log('Administrador criado/atualizado. Remova ADMIN_PASSWORD do ambiente após o primeiro uso.');
} finally {
  await client.end();
}
