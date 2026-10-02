import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';

import projectsRouter from './routes/projects.routes';
import ingestionRouter from './routes/ingestion.routes';
import processingRouter from './routes/processing.routes';
import propertiesRouter from './routes/properties.routes';
import reconciliationRouter from './routes/reconciliation.routes';
import graphRouter from './routes/graph.routes';
import easementsRouter from './routes/easements.routes';
import verificationRouter from './routes/verification.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use(`${config.apiPrefix}/projects`, projectsRouter);
app.use(`${config.apiPrefix}/ingestion`, ingestionRouter);
app.use(`${config.apiPrefix}/processing`, processingRouter);
app.use(`${config.apiPrefix}/properties`, propertiesRouter);
app.use(`${config.apiPrefix}/reconciliation`, reconciliationRouter);
app.use(`${config.apiPrefix}/graph`, graphRouter);
app.use(`${config.apiPrefix}/easements`, easementsRouter);
app.use(`${config.apiPrefix}/verification`, verificationRouter);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'salaahkaar-node-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

export default app;
