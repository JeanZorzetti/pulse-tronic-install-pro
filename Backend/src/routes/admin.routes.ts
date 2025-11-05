import { Router } from 'express';
import { authenticate, isAdminOrManager } from '../middlewares/auth';
import { QuoteController } from '../controllers/quote.controller';
import { ContactController } from '../controllers/contact.controller';
import { NotificationController } from '../controllers/notification.controller';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

// Apply authentication to all admin routes
router.use(authenticate);
router.use(isAdminOrManager);

/**
 * Dashboard
 */

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin/Manager)
 */
router.get('/dashboard/stats', DashboardController.getStats);

/**
 * Quotes Management
 */

/**
 * @route   GET /api/admin/quotes
 * @desc    Get all quotes with filters
 * @access  Private (Admin/Manager)
 */
router.get('/quotes', QuoteController.getAllAdmin);

/**
 * @route   GET /api/admin/quotes/:id
 * @desc    Get quote by ID
 * @access  Private (Admin/Manager)
 */
router.get('/quotes/:id', QuoteController.getByIdAdmin);

/**
 * @route   PUT /api/admin/quotes/:id
 * @desc    Update quote
 * @access  Private (Admin/Manager)
 */
router.put('/quotes/:id', QuoteController.updateAdmin);

/**
 * @route   DELETE /api/admin/quotes/:id
 * @desc    Delete quote
 * @access  Private (Admin/Manager)
 */
router.delete('/quotes/:id', QuoteController.deleteAdmin);

/**
 * Contacts Management
 */

/**
 * @route   GET /api/admin/contacts
 * @desc    Get all contacts with filters
 * @access  Private (Admin/Manager)
 */
router.get('/contacts', ContactController.getAllAdmin);

/**
 * @route   GET /api/admin/contacts/:id
 * @desc    Get contact by ID
 * @access  Private (Admin/Manager)
 */
router.get('/contacts/:id', ContactController.getByIdAdmin);

/**
 * @route   PATCH /api/admin/contacts/:id/status
 * @desc    Update contact status
 * @access  Private (Admin/Manager)
 */
router.patch('/contacts/:id/status', ContactController.updateStatusAdmin);

/**
 * @route   PUT /api/admin/contacts/:id
 * @desc    Update contact status/response
 * @access  Private (Admin/Manager)
 */
router.put('/contacts/:id', ContactController.updateAdmin);

/**
 * @route   DELETE /api/admin/contacts/:id
 * @desc    Delete contact
 * @access  Private (Admin/Manager)
 */
router.delete('/contacts/:id', ContactController.deleteAdmin);

/**
 * Notifications Management
 */

/**
 * @route   GET /api/admin/notifications
 * @desc    Get user notifications with pagination
 * @access  Private (Admin/Manager)
 */
router.get('/notifications', NotificationController.getNotifications);

/**
 * @route   GET /api/admin/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Private (Admin/Manager)
 */
router.get('/notifications/unread-count', NotificationController.getUnreadCount);

/**
 * @route   PATCH /api/admin/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private (Admin/Manager)
 */
router.patch('/notifications/:id/read', NotificationController.markAsRead);

/**
 * @route   PATCH /api/admin/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private (Admin/Manager)
 */
router.patch('/notifications/mark-all-read', NotificationController.markAllAsRead);

/**
 * @route   DELETE /api/admin/notifications/:id
 * @desc    Delete notification
 * @access  Private (Admin/Manager)
 */
router.delete('/notifications/:id', NotificationController.deleteNotification);

export default router;
