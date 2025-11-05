import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { loginSchema, refreshTokenSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, AuthController.getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, AuthController.logout);

export default router;
