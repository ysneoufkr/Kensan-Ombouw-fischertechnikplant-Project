import bcrypt from 'bcrypt';
import db from './db.js';
import fs from 'fs';
import path from 'path';
import { User, UserWithoutPassword } from './models/user.js';
import { UpdateProfileData } from './models/profile.js';

const SALT_ROUNDS = 10;

export function updateUserProfile(userId: number, data: UpdateProfileData): UserWithoutPassword | null {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User | undefined;

  if (!user) {
    throw new Error('User not found');
  }

  // ALWAYS require current password for any profile update
  if (!data.currentPassword) {
    throw new Error('Current password is required to update profile');
  }

  // Verify current password
  const isValid = bcrypt.compareSync(data.currentPassword, user.password);
  if (!isValid) {
    throw new Error('Current password is incorrect');
  }

  // Update name
  if (data.name && data.name !== user.name) {
    const stmt = db.prepare('UPDATE users SET name = ? WHERE id = ?');
    stmt.run(data.name, userId);
  }

  // Update email
  if (data.email && data.email !== user.email) {
    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(data.email, userId);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const stmt = db.prepare('UPDATE users SET email = ? WHERE id = ?');
    stmt.run(data.email, userId);
  }

  // Update password (if provided)
  if (data.password) {
    console.log('Updating password for user:', userId);
    console.log('New password (plain):', data.password);
    const hashedPassword = bcrypt.hashSync(data.password, SALT_ROUNDS);
    console.log('Hashed password:', hashedPassword);
    const stmt = db.prepare('UPDATE users SET password = ? WHERE id = ?');
    const result = stmt.run(hashedPassword, userId);
    console.log('Password update result:', result);
  }

  // Get updated user
  const updatedUser = db.prepare('SELECT id, email, name, role, profile_picture FROM users WHERE id = ?').get(userId) as UserWithoutPassword;
  return updatedUser;
}

export function updateProfilePicture(userId: number, filename: string): void {
  // Get old profile picture
  const user = db.prepare('SELECT profile_picture FROM users WHERE id = ?').get(userId) as { profile_picture?: string } | undefined;

  // Delete old profile picture if exists
  if (user?.profile_picture) {
    const oldPath = path.join(__dirname, '../profile_pictures', user.profile_picture);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  // Update database
  const stmt = db.prepare('UPDATE users SET profile_picture = ? WHERE id = ?');
  stmt.run(filename, userId);
}

export function deleteProfilePicture(userId: number): void {
  const user = db.prepare('SELECT profile_picture FROM users WHERE id = ?').get(userId) as { profile_picture?: string } | undefined;

  if (user?.profile_picture) {
    const picturePath = path.join(__dirname, '../profile_pictures', user.profile_picture);
    if (fs.existsSync(picturePath)) {
      fs.unlinkSync(picturePath);
    }
  }

  const stmt = db.prepare('UPDATE users SET profile_picture = NULL WHERE id = ?');
  stmt.run(userId);
}

export function deleteUserAccount(userId: number, password: string): boolean {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User | undefined;

  if (!user) {
    throw new Error('User not found');
  }

  // Verify password
  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    throw new Error('Incorrect password');
  }

  // Delete profile picture if exists
  if (user.profile_picture) {
    const picturePath = path.join(__dirname, '../profile_pictures', user.profile_picture);
    if (fs.existsSync(picturePath)) {
      fs.unlinkSync(picturePath);
    }
  }

  // Delete user from database
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const result = stmt.run(userId);

  return result.changes > 0;
}
