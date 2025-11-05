import { Router } from 'express';
import publicRoutes from './public.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Public API routes
router.use('/', publicRoutes);

// Authentication routes
router.use('/auth', authRoutes);

// Admin API routes (protected)
router.use('/admin', adminRoutes);

export default router;
