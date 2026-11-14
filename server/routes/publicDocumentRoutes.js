import express from 'express';
import {
  getPublicDocuments,
  getPublicDocumentBySlug,
  downloadPublicDocument,
  getPublicCategories,
} from '../controllers/publicDocumentController.js';
import {
  publicBrowseRateLimiter,
  publicDownloadRateLimiter,
} from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// Public document browsing and retrieval with practical IP rate limiting
router.get('/documents', publicBrowseRateLimiter, getPublicDocuments);
router.get('/documents/:slug', publicBrowseRateLimiter, getPublicDocumentBySlug);
router.get('/documents/:slug/download', publicDownloadRateLimiter, downloadPublicDocument);

// Public category listing for filters
router.get('/categories', publicBrowseRateLimiter, getPublicCategories);

export default router;
