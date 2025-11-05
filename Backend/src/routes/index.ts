import { Router } from 'express';
import publicRoutes from './public.routes';
// import adminRoutes from './admin.routes'; // Will be created later

const router = Router();

// Public API routes
router.use('/', publicRoutes);

// Admin API routes (protected)
// router.use('/admin', adminRoutes);

export default router;
