import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import { env } from '../config/env';

const prisma = new PrismaClient();

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('User account is inactive');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      // Verify refresh token
      // @ts-ignore - JWT types issue
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as TokenPayload;

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive) {
        return null;
      }

      // Generate new access token
      return this.generateAccessToken(user);
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      // @ts-ignore - JWT types issue
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate access token (short-lived)
   */
  private generateAccessToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // @ts-ignore - JWT types issue
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    });
  }

  /**
   * Generate refresh token (long-lived)
   */
  private generateRefreshToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // @ts-ignore - JWT types issue
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
  }

  /**
   * Hash password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
