import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { setupSwagger } from './utils/swagger';

export async function createApp(): Promise<Express> {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(helmet());
  app.use(compression());
  app.use(morgan(process.env.LOG_FORMAT || 'dev'));

  // Rate limiting
  app.use(rateLimiter);

  // Setup routes
  setupRoutes(app);

  // Setup Swagger documentation
  setupSwagger(app);

  // Error handling middleware (should be last)
  app.use(errorHandler);

  return app;
} 