import { Router, Express } from 'express';
import { PrismaClient } from '@prisma/client';
import Logger from '../utils/logger';
import userRoutes from './userRoutes';

export const setupRoutes = (app: Express): void => {
  const router = Router();
  const prisma = new PrismaClient();

  // Health check route
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Check API health status
   *     description: Returns the health status of the API including database connection and system metrics
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Health check passed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                 uptime:
   *                   type: number
   *                 environment:
   *                   type: string
   *                 database:
   *                   type: object
   *                   properties:
   *                     status:
   *                       type: string
   *                       example: connected
   *                 memory:
   *                   type: object
   *                   properties:
   *                     usage:
   *                       type: object
   *       500:
   *         description: Health check failed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: error
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   *                 error:
   *                   type: string
   */
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

  // API Routes
  router.use('/users', userRoutes);

  // TODO: Add other route modules here
  // router.use('/auth', authRouter);
  // router.use('/artists', artistRouter);
  // router.use('/albums', albumRouter);
  // router.use('/tracks', trackRouter);
  // router.use('/playlists', playlistRouter);

  // Mount all routes under API prefix
  app.use(process.env.API_PREFIX || '/api/v1', router);
}; 