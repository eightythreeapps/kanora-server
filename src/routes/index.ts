import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import Logger from '../utils/logger';

export const setupRoutes = (): Router => {
  const router = Router();
  const prisma = new PrismaClient();

  // Health check route
  router.get('/health', async (_req, res) => {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: {
          status: 'connected',
        },
        memory: {
          usage: process.memoryUsage(),
        },
      };

      Logger.info('Health check passed');
      res.json(health);
    } catch (error) {
      Logger.error('Health check failed:', error);
      res.status(500).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      });
    }
  });

  // TODO: Add other route modules here
  // router.use('/auth', authRouter);
  // router.use('/users', userRouter);
  // router.use('/artists', artistRouter);
  // router.use('/albums', albumRouter);
  // router.use('/tracks', trackRouter);
  // router.use('/playlists', playlistRouter);

  return router;
}; 