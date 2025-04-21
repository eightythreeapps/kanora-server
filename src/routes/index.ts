import { Router } from 'express';

export const setupRoutes = (): Router => {
  const router = Router();

  // Health check route
  router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
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