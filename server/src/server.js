import { buildApp } from './app.js';
import { config } from './config.js';
import { db } from './db.js';

const app = await buildApp();
const shutdown = async signal => {
  app.log.info({ signal }, 'encerrando servidor');
  await app.close();
  await db.end();
  process.exit(0);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

await app.listen({ host: config.HOST, port: config.PORT });
