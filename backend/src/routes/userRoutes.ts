import { Router } from 'express';
import {
    deluser,
    login,
    logout,
    me,
    register
} from '../controllers/userController';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);
router.post('/register', register);
router.post('/deluser', deluser);

export default router;