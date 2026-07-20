import argon2 from 'argon2';
import { z } from 'zod';
import { requirePermission } from '../middleware/auth.js';

const createUserSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().transform(value => value.trim().toLowerCase()),
  password: z.string().min(12).max(200),
  role: z.enum(['admin','gerente','atendente','producao','estoquista']),
});

export default async function userRoutes(app) {
  app.get('/users', { preHandler: requirePermission('users.manage') }, async () => {
    const { rows } = await app.db.query(`
      SELECT u.id,u.name,u.email,u.active,u.last_login_at,u.created_at,r.name AS role
      FROM users u JOIN roles r ON r.id=u.role_id ORDER BY u.name
    `);
    return { data: rows };
  });

  app.post('/users', { preHandler: requirePermission('users.manage') }, async (request, reply) => {
    const parsed = createUserSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'validation_error', details: parsed.error.flatten() });
    const role = await app.db.query('SELECT id FROM roles WHERE name=$1', [parsed.data.role]);
    const passwordHash = await argon2.hash(parsed.data.password, { type: argon2.argon2id });
    try {
      const { rows } = await app.db.query(`
        INSERT INTO users (role_id,name,email,password_hash) VALUES ($1,$2,$3,$4)
        RETURNING id,name,email,active,created_at
      `, [role.rows[0].id,parsed.data.name,parsed.data.email,passwordHash]);
      await app.db.query(`INSERT INTO audit_logs (user_id,action,entity_type,entity_id,ip)
        VALUES ($1,'user.create','user',$2,$3)`, [request.user.id,rows[0].id,request.ip]);
      return reply.code(201).send({ data: { ...rows[0], role: parsed.data.role } });
    } catch (error) {
      if (error.code === '23505') return reply.code(409).send({ error: 'email_already_exists' });
      throw error;
    }
  });

  app.patch('/users/:id/status', { preHandler: requirePermission('users.manage') }, async (request, reply) => {
    const body = z.object({ active: z.boolean() }).safeParse(request.body);
    const id = z.string().uuid().safeParse(request.params.id);
    if (!body.success || !id.success) return reply.code(400).send({ error: 'validation_error' });
    if (id.data === request.user.id && !body.data.active) return reply.code(400).send({ error: 'cannot_disable_self' });
    const { rows } = await app.db.query('UPDATE users SET active=$1,updated_at=now() WHERE id=$2 RETURNING id,name,email,active', [body.data.active,id.data]);
    if (!rows.length) return reply.code(404).send({ error: 'user_not_found' });
    if (!body.data.active) await app.db.query('DELETE FROM sessions WHERE user_id=$1', [id.data]);
    return { data: rows[0] };
  });
}
