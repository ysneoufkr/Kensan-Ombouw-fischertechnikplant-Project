import bcrypt from 'bcrypt';
import db from './db.js';
<<<<<<< HEAD
import type { User, UserWithoutPassword } from './types.js';
import 'dotenv/config'; 
=======
import { User, UserWithoutPassword } from './models/user.js';
import { Request, Response } from 'express';
import { JWTPayload } from './models/jwt.js';
import jwt from 'jsonwebtoken';
>>>>>>> main

const SALT_ROUNDS = 10;
const JWT_SECRET = 'kensan-secret-key-change-in-production';

export function createUser(email: string, password: string, name: string, role: string = 'user'): number {
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  const normalizedEmail = email.toLowerCase();

  try {
    const stmt = db.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(normalizedEmail, hashedPassword, name, role);
    return Number(result.lastInsertRowid);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export function verifyUser(email: string, password: string): UserWithoutPassword | null {
  const normalizedEmail = email.toLowerCase();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(normalizedEmail) as User | undefined;

  console.log('Verifying user:', normalizedEmail, 'Found:', !!user);

  if (!user) {
    console.log('User not found in database');
    return null;
  }

  const isValid = bcrypt.compareSync(password, user.password);

  console.log('Password validation:', isValid);

  if (!isValid) {
    console.log('Invalid password for user:', email);
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getUserById(id: number): UserWithoutPassword | undefined {
  const stmt = db.prepare('SELECT id, email, name, role, profile_picture FROM users WHERE id = ?');
  return stmt.get(id) as UserWithoutPassword | undefined;
}

export function getAllUsers(): UserWithoutPassword[] {
  const stmt = db.prepare('SELECT id, email, name, role, created_at FROM users');
  return stmt.all() as UserWithoutPassword[];
}

export function deleteUserByEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase();
  const stmt = db.prepare('DELETE FROM users WHERE email = ?');
  const result = stmt.run(normalizedEmail);

  if (result.changes === 0) {
    throw new Error('User not found');
  }

  return true;
}

export const verifyToken = (req: Request, res: Response, next: any) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export function initDefaultUser(): void {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const result = stmt.get() as { count: number };

  if (result.count === 0) {
    console.log('Creating default admin user...');

    createUser(
      process.env.DEFAULT_ADMIN_EMAIL!,
      process.env.DEFAULT_ADMIN_PASSWORD!,
      process.env.DEFAULT_ADMIN_NAME || 'Administrator',
      process.env.DEFAULT_ADMIN_ROLE || 'admin'
    );

    console.log(`Default admin user created: ${process.env.DEFAULT_ADMIN_EMAIL}`);
  }
}
