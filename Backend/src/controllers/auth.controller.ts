import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponseUtil } from '../utils/response';
import { AuthRequest } from '../types';

const authService = AuthService.getInstance();

export class AuthController {
  /**
   * Login - POST /api/auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return ApiResponseUtil.error(res, 'Email and password are required', 400);
      }

      // Attempt login
      const result = await authService.login(email, password);

      if (!result) {
        return ApiResponseUtil.error(res, 'Invalid email or password', 401);
      }

      return ApiResponseUtil.success(res, result, 'Login successful');
    } catch (error) {
      console.error('Error in login:', error);

      if (error instanceof Error && error.message === 'User account is inactive') {
        return ApiResponseUtil.error(res, 'Account is inactive. Contact administrator.', 403);
      }

      return ApiResponseUtil.serverError(res, 'Error during login');
    }
  }

  /**
   * Refresh token - POST /api/auth/refresh
   */
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return ApiResponseUtil.error(res, 'Refresh token is required', 400);
      }

      const newAccessToken = await authService.refreshAccessToken(refreshToken);

      if (!newAccessToken) {
        return ApiResponseUtil.error(res, 'Invalid or expired refresh token', 401);
      }

      return ApiResponseUtil.success(
        res,
        { accessToken: newAccessToken },
        'Token refreshed successfully'
      );
    } catch (error) {
      console.error('Error refreshing token:', error);
      return ApiResponseUtil.serverError(res, 'Error refreshing token');
    }
  }

  /**
   * Get current user - GET /api/auth/me
   * Requires authentication
   */
  static async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return ApiResponseUtil.error(res, 'User not found', 404);
      }

      // In a real app, you'd fetch the user from database
      // For now, return the data from the token
      return ApiResponseUtil.success(res, {
        id: req.user?.userId,
        email: req.user?.email,
        role: req.user?.role,
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      return ApiResponseUtil.serverError(res, 'Error fetching user data');
    }
  }

  /**
   * Logout - POST /api/auth/logout
   * In a stateless JWT implementation, logout is handled client-side
   * by removing the tokens. This endpoint is here for consistency
   * and can be used for logging/analytics.
   */
  static async logout(_req: AuthRequest, res: Response) {
    // In a stateless JWT system, we don't need to do anything server-side
    // The client should remove the tokens from storage

    // If you want to implement token blacklisting in the future,
    // you can add that logic here with Redis

    return ApiResponseUtil.success(res, null, 'Logged out successfully');
  }
}
