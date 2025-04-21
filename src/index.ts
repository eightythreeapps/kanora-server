import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { setupRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false  // Disable CSP for Swagger UI
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(compression());
app.use(morgan(process.env.LOG_FORMAT || 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
});
app.use(limiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Kanora Server API Documentation',
}));

// Setup API Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
}); 