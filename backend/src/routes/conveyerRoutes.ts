import { Router } from 'express';
import { conveyerStatus } from '../controllers/conveyerController';

const router = Router();

router.get('/status', conveyerStatus);

export default router;