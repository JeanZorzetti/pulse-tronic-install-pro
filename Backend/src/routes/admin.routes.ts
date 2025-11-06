import { Router } from 'express';
import { authenticate, isAdminOrManager } from '../middlewares/auth';
import { QuoteController } from '../controllers/quote.controller';
import { ContactController } from '../controllers/contact.controller';
import { NotificationController } from '../controllers/notification.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { ServiceController } from '../controllers/service.controller';

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
 * @route   GET /api/admin/dashboard/charts
 * @desc    Get dashboard charts data
 * @access  Private (Admin/Manager)
 */
router.get('/dashboard/charts', DashboardController.getCharts);

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
 * @route   PATCH /api/admin/quotes/:id/status
 * @desc    Update quote status
 * @access  Private (Admin/Manager)
 */
router.patch('/quotes/:id/status', QuoteController.updateStatusAdmin);

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
 * @route   GET /api/admin/quotes/export/csv
 * @desc    Export quotes to CSV
 * @access  Private (Admin/Manager)
 */
router.get('/quotes/export/csv', QuoteController.exportCSVAdmin);

/**
 * @route   GET /api/admin/quotes/export/pdf
 * @desc    Export quotes to PDF
 * @access  Private (Admin/Manager)
 */
router.get('/quotes/export/pdf', QuoteController.exportPDFAdmin);

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

/**
 * Services Management (CMS)
 */

/**
 * @route   GET /api/admin/services
 * @desc    Get all services (including inactive)
 * @access  Private (Admin/Manager)
 */
router.get('/services', ServiceController.getAllAdmin);

/**
 * @route   GET /api/admin/services/:id
 * @desc    Get service by ID
 * @access  Private (Admin/Manager)
 */
router.get('/services/:id', ServiceController.getByIdAdmin);

/**
 * @route   POST /api/admin/services
 * @desc    Create new service
 * @access  Private (Admin/Manager)
 */
router.post('/services', ServiceController.createAdmin);

/**
 * @route   PUT /api/admin/services/:id
 * @desc    Update service
 * @access  Private (Admin/Manager)
 */
router.put('/services/:id', ServiceController.updateAdmin);

/**
 * @route   DELETE /api/admin/services/:id
 * @desc    Delete service
 * @access  Private (Admin/Manager)
 */
router.delete('/services/:id', ServiceController.deleteAdmin);

/**
 * @route   PATCH /api/admin/services/:id/toggle-active
 * @desc    Toggle service active status
 * @access  Private (Admin/Manager)
 */
router.patch('/services/:id/toggle-active', ServiceController.toggleActiveAdmin);

export default router;
