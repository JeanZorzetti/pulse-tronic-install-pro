import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { Logger } from './services/logger.service';
import { requestLogger } from './middlewares/requestLogger';

// Import routes
import routes from './routes';

const app: Application = express();

// Security Middleware
app.use(helmet());

// CORS Configuration with detailed logging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  Logger.info('CORS Request received', {
    method: req.method,
    origin,
    path: req.path,
    allowedOrigins: [env.FRONTEND_URL, env.ADMIN_URL],
  });
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      Logger.info('CORS origin check', {
        requestOrigin: origin,
        allowedOrigins: [env.FRONTEND_URL, env.ADMIN_URL],
        isAllowed: !origin || [env.FRONTEND_URL, env.ADMIN_URL].includes(origin)
      });

      if (!origin || [env.FRONTEND_URL, env.ADMIN_URL].includes(origin)) {
        callback(null, true);
      } else {
        Logger.error('CORS origin rejected', { origin });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Explicit OPTIONS handler for all routes
app.options('*', cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware
app.use(requestLogger);

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  Logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  // Don't leak error details in production
  const message = env.NODE_ENV === 'production'
    ? 'Erro interno do servidor'
    : err.message;

  res.status(500).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Server
const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  Logger.info('🚀 Pulse Tronic Backend API Started', {
    port: PORT,
    environment: env.NODE_ENV,
    apiUrl: env.API_URL,
    healthCheck: `${env.API_URL}/health`,
  });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  Logger.warn('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    Logger.info('HTTP server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  Logger.warn('SIGINT signal received: closing HTTP server');
  server.close(() => {
    Logger.info('HTTP server closed gracefully');
    process.exit(0);
  });
});

export default app;
