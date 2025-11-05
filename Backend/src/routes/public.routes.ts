import { Router } from 'express';
import { QuoteController } from '../controllers/quote.controller';
import { ContactController } from '../controllers/contact.controller';
import { ServiceController } from '../controllers/service.controller';
import { FAQController } from '../controllers/faq.controller';
import { TestimonialController } from '../controllers/testimonial.controller';
import { validate } from '../middlewares/validate';
import { createQuoteSchema } from '../validators/quote.validator';
import { createContactSchema } from '../validators/contact.validator';

const router = Router();

// ==========================================
// Public Routes (No authentication required)
// ==========================================

// Quotes
router.post('/quotes', validate(createQuoteSchema), QuoteController.create);

// Contact
router.post('/contacts', validate(createContactSchema), ContactController.create);

// Services
router.get('/services', ServiceController.getAll);
router.get('/services/:slug', ServiceController.getBySlug);

// FAQs
router.get('/faqs', FAQController.getAll);

// Testimonials
router.get('/testimonials', TestimonialController.getAll);

export default router;
