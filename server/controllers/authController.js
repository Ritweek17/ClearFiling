import AdminUser from '../models/AdminUser.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/tokenUtils.js';

/**
 * Administrator Login.
 * Validates credentials, verifies active status, issues HttpOnly cookie.
 * 
 * POST /api/admin/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Query user and explicitly select passwordHash
    const admin = await AdminUser.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Inactive admin check
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact an administrator.',
      });
    }

    // Compare password with bcrypt hash
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: admin._id,
      role: admin.role,
    });

    // Attach HttpOnly cookie
    setAuthCookie(res, token);

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Administrator Logout.
 * Clears the session cookie.
 * 
 * POST /api/admin/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current Authenticated Administrator Profile.
 * 
 * GET /api/admin/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const admin = req.admin;

    return res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { login, logout, getMe };

