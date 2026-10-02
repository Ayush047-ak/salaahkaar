import app from './app';
import { config } from './config';
import { closePostgres } from './integrations/postgres.client';
import { closeNeo4j } from './integrations/neo4j.client';

const server = app.listen(config.port, () => {
  console.log(`🏛️  Salaahkaar Node API listening at http://localhost:${config.port}${config.apiPrefix}`);
});

const gracefulShutdown = async () => {
  console.log('SIGTERM/SIGINT signal received: closing HTTP server');
  
  server.close(async () => {
    console.log('HTTP server closed');
    
    console.log('Closing database connections...');
    try {
      await Promise.all([
        closePostgres(),
        closeNeo4j()
      ]);
      console.log('Database connections closed gracefully');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
  
  // Force close after 10s
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
