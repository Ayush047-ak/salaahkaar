import { Pool } from 'pg';
import { config } from '../config';

export const pgPool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const queryPostgres = async (text: string, params?: any[]) => {
  const start = Date.now();
  const result = await pgPool.query(text, params);
  const duration = Date.now() - start;
  if (config.nodeEnv === 'development') {
    console.log(`[PG] ${duration}ms | rows=${result.rowCount} | ${text.slice(0, 80)}...`);
  }
  return result;
};

export const checkPostgresConnection = async (): Promise<boolean> => {
  try {
    await pgPool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
};

// Graceful shutdown
export const closePostgres = async () => {
  await pgPool.end();
};
