import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponseUtil } from '../utils/response';
import { AuthRequest } from '../types';
import { UserRole } from '@prisma/client';

const authService = AuthService.getInstance();

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ApiResponseUtil.error(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = authService.verifyAccessToken(token);

    if (!decoded) {
      ApiResponseUtil.error(res, 'Invalid or expired token', 401);
      return;
    }

    // Attach user data to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    ApiResponseUtil.error(res, 'Authentication failed', 401);
    return;
  }
};

/**
 * Middleware to check if user has required role(s)
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ApiResponseUtil.error(res, 'User not authenticated', 401);
      return;
    }

    const userRole = req.user.role as UserRole;

    if (!allowedRoles.includes(userRole)) {
      ApiResponseUtil.error(
        res,
        'You do not have permission to access this resource',
        403
      );
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    ApiResponseUtil.error(res, 'User not authenticated', 401);
    return;
  }

  if (req.user.role !== UserRole.ADMIN) {
    ApiResponseUtil.error(res, 'Admin access required', 403);
    return;
  }

  next();
};

/**
 * Middleware to check if user is admin or manager
 */
export const isAdminOrManager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    ApiResponseUtil.error(res, 'User not authenticated', 401);
    return;
  }

  const allowedRoles: UserRole[] = [UserRole.ADMIN, UserRole.MANAGER];
  const userRole = req.user.role as UserRole;

  if (!allowedRoles.includes(userRole)) {
    ApiResponseUtil.error(res, 'Admin or Manager access required', 403);
    return;
  }

  next();
};
