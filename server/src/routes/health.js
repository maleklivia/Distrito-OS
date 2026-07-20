export default async function healthRoutes(app) {
  app.get('/health', async () => {
    await app.db.query('SELECT 1');
    return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
  });
}
