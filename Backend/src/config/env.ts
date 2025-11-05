import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment variables schema validation
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  API_URL: z.string().url(),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_SECURE: z.string().transform((val) => val === 'true'),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),
  ADMIN_EMAIL: z.string().email(),

  // WhatsApp (optional)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_WHATSAPP_NUMBER: z.string().optional(),
  ADMIN_WHATSAPP: z.string().optional(),

  // Google Maps (optional)
  GOOGLE_MAPS_API_KEY: z.string().optional(),

  // Frontend URLs
  FRONTEND_URL: z.string().url(),
  ADMIN_URL: z.string().url(),

  // AWS S3 (optional)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_BUCKET_NAME: z.string().optional(),
  AWS_REGION: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).default('10'),

  // Sentry (optional)
  SENTRY_DSN: z.string().url().optional(),
});

// Validate and parse environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`   ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
