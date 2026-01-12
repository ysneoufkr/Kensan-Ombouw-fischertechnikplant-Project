import { updateUserProfile, updateProfilePicture, deleteProfilePicture, deleteUserAccount } from '../profile.js';
import { Request, Response } from 'express';
import { getUserById } from '../auth.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '../../profile_pictures');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


export const updateProfile = ((req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { name, email, currentPassword, password } = req.body;

        console.log('Profile update request:', { userId, name, email, hasCurrentPassword: !!currentPassword, hasPassword: !!password });

        // Capitalize first letter of each word in name if name is provided
        const capitalizedName = name ? name.split(' ').map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ') : undefined;

        const updatedUser = updateUserProfile(userId, {
            name: capitalizedName,
            email,
            currentPassword,
            password
        });

        res.json({
            success: true,
            user: updatedUser
        });
    } catch (error: any) {
        console.error('Profile update error:', error.message);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export const uploadProfilePicture = (async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const userId = (req as any).user.userId;
        const filename = `${userId}-${Date.now()}.jpg`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Resize and convert to JPEG
        await sharp(req.file.buffer)
            .resize(512, 512, { fit: 'cover' })
            .jpeg({ quality: 90 })
            .toFile(filepath);

        // Update database
        updateProfilePicture(userId, filename);

        const user = getUserById(userId);

        res.json({
            success: true,
            profile_picture: `/profile_pictures/${filename}`,
            user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload picture'
        });
    }
});

export const uploadProfilePictureForUser = (async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const targetUserId = parseInt(req.body.userId);
        if (!targetUserId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const filename = `${targetUserId}-${Date.now()}.jpg`;
        const filepath = path.join(UPLOAD_DIR, filename);

        // Resize and convert to JPEG
        await sharp(req.file.buffer)
            .resize(512, 512, { fit: 'cover' })
            .jpeg({ quality: 90 })
            .toFile(filepath);

        // Update database
        updateProfilePicture(targetUserId, filename);

        const user = getUserById(targetUserId);

        res.json({
            success: true,
            profile_picture: `/profile_pictures/${filename}`,
            user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload picture'
        });
    }
});

export const deletePicture = ((req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        deleteProfilePicture(userId);

        const user = getUserById(userId);

        res.json({
            success: true,
            user
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete picture'
        });
    }
});

export const deleteAccount = ((req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        deleteUserAccount(userId, password);

        // Clear auth cookie
        res.clearCookie('auth_token');

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to delete account'
        });
    }
});