import neo4j, { Driver } from 'neo4j-driver';
import { config } from '../config';

let driver: Driver | null = null;

export const getNeo4jDriver = (): Driver => {
  if (!driver) {
    driver = neo4j.driver(
      config.neo4j.uri,
      neo4j.auth.basic(config.neo4j.user, config.neo4j.password)
    );
  }
  return driver;
};

export const runCypher = async (query: string, params: Record<string, any> = {}) => {
  const d = getNeo4jDriver();
  const session = d.session();
  try {
    const result = await session.run(query, params);
    return result.records;
  } finally {
    await session.close();
  }
};

export const checkNeo4jConnection = async (): Promise<boolean> => {
  try {
    const d = getNeo4jDriver();
    const info = await d.getServerInfo();
    return !!info;
  } catch {
    return false;
  }
};

export const closeNeo4j = async () => {
  if (driver) {
    await driver.close();
    driver = null;
  }
};
