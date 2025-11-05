import { Router } from 'express';
import { authenticate, isAdminOrManager } from '../middlewares/auth';
import { QuoteController } from '../controllers/quote.controller';
import { ContactController } from '../controllers/contact.controller';

const router = Router();

// Apply authentication to all admin routes
router.use(authenticate);
router.use(isAdminOrManager);

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

export default router;
