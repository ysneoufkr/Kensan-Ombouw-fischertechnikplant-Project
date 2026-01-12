import { Router } from 'express';
import { craneStatus } from '../controllers/craneController';

const router = Router();

router.get('/status', craneStatus);

export default router;