import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  geospatialServiceUrl: process.env.GEOSPATIAL_SERVICE_URL || 'http://localhost:8000',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://salaahkaar_user:salaahkaar_password@localhost:5432/salaahkaar_db',
  neo4j: {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || process.env.NEO4J_USERNAME || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'salaahkaar_secret',
  },
};
