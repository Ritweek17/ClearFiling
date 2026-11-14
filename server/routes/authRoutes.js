import express from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { loginRateLimiter } from '../middleware/rateLimitMiddleware.js';
import { csrfProtection } from '../middleware/csrfMiddleware.js';

const router = express.Router();

// Public login with rate limiting
router.post('/login', loginRateLimiter, login);

// Authenticated session termination with CSRF protection
router.post('/logout', csrfProtection, authenticateAdmin, logout);

// Authenticated current-user profile verification
router.get('/me', authenticateAdmin, getMe);

export default router;

