import winston from 'winston';
import { env } from '../config/env';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;

  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }

  if (stack) {
    msg += `\n${stack}`;
  }

  return msg;
});

// Create Winston logger
const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    env.NODE_ENV === 'production' ? json() : combine(colorize(), devFormat)
  ),
  defaultMeta: { service: 'pulse-tronic-backend' },
  transports: [
    // Console transport
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
  ],
});

// Add file transports in production
if (env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create a stream object for Morgan HTTP logger
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Export logger with typed methods
export class Logger {
  static error(message: string, meta?: any) {
    logger.error(message, meta);
  }

  static warn(message: string, meta?: any) {
    logger.warn(message, meta);
  }

  static info(message: string, meta?: any) {
    logger.info(message, meta);
  }

  static http(message: string, meta?: any) {
    logger.http(message, meta);
  }

  static debug(message: string, meta?: any) {
    logger.debug(message, meta);
  }
}

export default logger;
