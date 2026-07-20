import argon2 from 'argon2';
import { z } from 'zod';
import { config } from '../config.js';
import {
  authenticate, cookieOptions, createToken, hashToken, SESSION_COOKIE,
} from '../middleware/auth.js';

const loginSchema = z.object({
  email: z.string().email().transform(value => value.trim().toLowerCase()),
  password: z.string().min(8).max(200),
});

export default async function authRoutes(app) {
  app.post('/auth/login', {
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
  }, async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'invalid_credentials' });

    const result = await app.db.query(`
      SELECT u.*, r.name AS role FROM users u JOIN roles r ON r.id = u.role_id
      WHERE u.email = $1
    `, [parsed.data.email]);
    const user = result.rows[0];

    if (!user || !user.active || (user.locked_until && new Date(user.locked_until) > new Date())) {
      return reply.code(401).send({ error: 'invalid_credentials' });
    }

    const valid = await argon2.verify(user.password_hash, parsed.data.password);
    if (!valid) {
      await app.db.query(`
        UPDATE users SET failed_login_attempts = failed_login_attempts + 1,
          locked_until = CASE WHEN failed_login_attempts + 1 >= 5 THEN now() + interval '15 minutes' ELSE locked_until END
        WHERE id = $1
      `, [user.id]);
      return reply.code(401).send({ error: 'invalid_credentials' });
    }

    const token = createToken();
    await app.db.query(`
      UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = now() WHERE id = $1;
    `, [user.id]);
    await app.db.query(`
      INSERT INTO sessions (user_id, token_hash, expires_at, ip, user_agent)
      VALUES ($1, $2, now() + ($3 || ' hours')::interval, $4, $5)
    `, [user.id, hashToken(token), String(config.SESSION_HOURS), request.ip, request.headers['user-agent'] || '']);

    reply.setCookie(SESSION_COOKIE, token, cookieOptions);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  });

  app.post('/auth/logout', { preHandler: authenticate }, async (request, reply) => {
    const signed = request.unsignCookie(request.cookies[SESSION_COOKIE]);
    if (signed.valid) await app.db.query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(signed.value)]);
    reply.clearCookie(SESSION_COOKIE, cookieOptions);
    return { ok: true };
  });

  app.get('/auth/me', { preHandler: authenticate }, async request => ({ user: request.user }));
}
