import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
    }),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
