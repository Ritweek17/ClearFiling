import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';
import { connectDB, disconnectDB } from '../config/db.js';

// Resolve paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Parse command line arguments into a dictionary.
 * Supports flags: --email, --password, --name
 */
const parseArgs = () => {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      parsed[key] = value;
      if (value !== true) i++;
    }
  }
  return parsed;
};

/**
 * Provision initial Super Administrator via secure CLI.
 * Strictly prevents overwriting existing super administrators.
 */
export const seedAdmin = async () => {
  const args = parseArgs();

  const name = args.name || process.env.SEED_ADMIN_NAME || 'ClearFiling Super Admin';
  const email = (args.email || process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = args.password || process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Usage: node scripts/seedAdmin.js --email <email> --password <password> [--name <name>]');
    console.error('Or provide SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in environment variables.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Error: Password must be at least 8 characters in length.');
    process.exit(1);
  }

  try {
    await connectDB();

    // 1. Check if a super_admin already exists with this email
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      console.log(`[ABORTED] An administrator with email "${email}" already exists (Role: ${existingUser.role}).`);
      console.log('Super-admin provisioning aborted. Existing accounts are never overwritten.');
      await disconnectDB();
      process.exit(0);
    }

    // 2. Hash password with exactly 12 bcrypt salt rounds
    const passwordHash = await AdminUser.hashPassword(password);

    // 3. Create super_admin record
    const superAdmin = await AdminUser.create({
      name,
      email,
      passwordHash,
      role: 'super_admin',
      isActive: true,
    });

    console.log('───────────────────────────────────────────────────────');
    console.log('✓ Super Administrator provisioned successfully!');
    console.log(`  ID:    ${superAdmin._id}`);
    console.log(`  Name:  ${superAdmin.name}`);
    console.log(`  Email: ${superAdmin.email}`);
    console.log(`  Role:  ${superAdmin.role}`);
    console.log('───────────────────────────────────────────────────────');
    console.log('Note: Password has been hashed securely (12 rounds) and was not logged.');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to provision super administrator:', error.message);
    await disconnectDB().catch(() => {});
    process.exit(1);
  }
};

// Execute if run directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedAdmin();
}

export default seedAdmin;
