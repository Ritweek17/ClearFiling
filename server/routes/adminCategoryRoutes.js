import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/adminCategoryController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { csrfProtection } from '../middleware/csrfMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

// Require authentication for all admin category operations
router.use(authenticateAdmin);

// List all categories (available to all admin roles: super_admin, admin, editor)
router.get('/', getCategories);

// Category mutations (restricted to super_admin and admin, CSRF-protected)
router.post('/', csrfProtection, authorizeRoles('super_admin', 'admin'), createCategory);

router.patch(
  '/:id',
  csrfProtection,
  validateObjectId('id'),
  authorizeRoles('super_admin', 'admin'),
  updateCategory
);

router.delete(
  '/:id',
  csrfProtection,
  validateObjectId('id'),
  authorizeRoles('super_admin', 'admin'),
  deleteCategory
);

export default router;

