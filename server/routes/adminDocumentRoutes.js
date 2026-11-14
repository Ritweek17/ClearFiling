import express from 'express';
import {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  publishDocument,
  archiveDocument,
  replaceDocumentFile,
} from '../controllers/adminDocumentController.js';
import { authenticateAdmin, authorizeRoles } from '../middleware/authMiddleware.js';
import { csrfProtection } from '../middleware/csrfMiddleware.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import { requireDocumentUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Require authentication for all admin document endpoints
router.use(authenticateAdmin);

// Document listing and creation
router.get('/', getDocuments);

router.post(
  '/',
  csrfProtection,
  requireDocumentUpload('file', true),
  createDocument
);

// Single document operations
router.get('/:id', validateObjectId('id'), getDocumentById);

router.patch(
  '/:id',
  csrfProtection,
  validateObjectId('id'),
  updateDocument
);

router.delete(
  '/:id',
  csrfProtection,
  validateObjectId('id'),
  authorizeRoles('super_admin', 'admin'),
  deleteDocument
);

// Lifecycle state transitions
router.patch(
  '/:id/publish',
  csrfProtection,
  validateObjectId('id'),
  authorizeRoles('super_admin', 'admin'),
  publishDocument
);

router.patch(
  '/:id/archive',
  csrfProtection,
  validateObjectId('id'),
  authorizeRoles('super_admin', 'admin'),
  archiveDocument
);

// File replacement
router.post(
  '/:id/replace-file',
  csrfProtection,
  validateObjectId('id'),
  authorizeRoles('super_admin', 'admin'),
  requireDocumentUpload('file', true),
  replaceDocumentFile
);

export default router;

