import { Request, Response, NextFunction } from 'express';
import { Logger } from '../services/logger.service';

/**
 * Middleware to log HTTP requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    const logData = {
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: req.get('user-agent') || 'unknown',
    };

    // Log based on status code
    if (statusCode >= 500) {
      Logger.error(`${method} ${originalUrl} - ${statusCode}`, logData);
    } else if (statusCode >= 400) {
      Logger.warn(`${method} ${originalUrl} - ${statusCode}`, logData);
    } else {
      Logger.http(`${method} ${originalUrl} - ${statusCode}`, logData);
    }
  });

  next();
};
