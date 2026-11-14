import AdminUser from '../models/AdminUser.js';
import { verifyToken, COOKIE_NAME } from '../utils/tokenUtils.js';

/**
 * Middleware to authenticate requests using JWT stored in HttpOnly cookie
 * (with fallback to Bearer header for programmatic API consumers).
 */
export const authenticateAdmin = async (req, res, next) => {
  try {
    let token = req.cookies?.[COOKIE_NAME];

    // Optional fallback to Bearer token header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No session token provided.',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(401).json({
        success: false,
        message: isExpired
          ? 'Session expired. Please log in again.'
          : 'Invalid authentication token.',
      });
    }

    // Lookup user in database
    const admin = await AdminUser.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Session invalid. Administrator account not found.',
      });
    }

    // Inactive admin rejection check
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact an administrator.',
      });
    }

    // Attach verified admin to request object
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication verification error.',
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    });
  }
};

/**
 * Middleware factory for Role-Based Access Control (RBAC).
 * 
 * @param  {...string} roles - Allowed roles (e.g. 'super_admin', 'admin', 'editor')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.admin.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

export default { authenticateAdmin, authorizeRoles };

