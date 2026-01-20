import { Router } from 'express';
import { deleteAccount, deletePicture, updateProfile, uploadProfilePicture, uploadProfilePictureForUser } from '../controllers/profileController';
import { verifyToken } from '../auth.js';
import multer from 'multer';


const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

router.post('/update', verifyToken, updateProfile)
router.post('/upload-picture', upload.single('profilePicture'), verifyToken, uploadProfilePicture)
router.post('/upload-picture-for-user', upload.single('profilePicture'), verifyToken, uploadProfilePictureForUser)
router.delete('/delete-picture', verifyToken, deletePicture)
router.delete('/delete-account', verifyToken, deleteAccount)

export default router;