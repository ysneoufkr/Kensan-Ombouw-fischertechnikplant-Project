import { verifyUser, getUserById, createUser, deleteUserByEmail } from '../auth.js';
import { Request, Response } from 'express';
import { JWTPayload } from '../models/jwt.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'kensan-secret-key-change-in-production';
const JWT_EXPIRY = '24h';

export const login = ((req: Request, res: Response) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, timestamp: new Date().toISOString() });

    if (!email || !password) {
        console.log('Login failed: Missing email or password');
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('Login failed: Invalid email format');
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }

    const user = verifyUser(email, password);

    if (!user) {
        console.log('Login failed: Invalid credentials for email:', email);
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role } as JWTPayload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    });

    console.log('Login successful:', { email, userId: user.id });

    res.json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
});

export const logout = ((req: Request, res: Response) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
});

export const me = ((req: Request, res: Response) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        const user = getUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

export const register = ((req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: 'Email, password and name are required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email address'
        });
    }

    // Capitalize first letter of each word in name
    const capitalizedName = name.split(' ').map((word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');

    try {
        const userId = createUser(email, password, capitalizedName);
        const user = getUserById(userId);

        res.status(201).json({
            success: true,
            user
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message === 'Email already exists' ? 'Email already exists' : 'Registration failed'
        });
    }
});

export const deluser = ((req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        deleteUserByEmail(email);
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message === 'User not found' ? 'User not found' : 'Failed to delete user'
        });
    }
});