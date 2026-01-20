import { Router } from 'express';
import { ovenStatus } from '../controllers/ovenController';

const router = Router();

router.get('/status', ovenStatus);

export default router;