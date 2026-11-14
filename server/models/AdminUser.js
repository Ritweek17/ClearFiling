import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Omit from default query projections
    },
    role: {
      type: String,
      enum: {
        values: ['super_admin', 'admin', 'editor'],
        message: '{VALUE} is not a valid admin role',
      },
      default: 'admin',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Static utility to hash plain password with exactly 12 bcrypt salt rounds.
 * 
 * @param {string} plainPassword 
 * @returns {Promise<string>}
 */
adminUserSchema.statics.hashPassword = async function (plainPassword) {
  if (!plainPassword || plainPassword.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Instance method to compare candidate plain password with stored hash.
 * 
 * @param {string} candidatePassword 
 * @returns {Promise<boolean>}
 */
adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) {
    throw new Error('passwordHash is not selected on this user document.');
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;

