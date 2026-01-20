import { Router } from 'express';
import { craneAssignment, craneStatus } from '../controllers/craneController';

const router = Router();

router.get('/status', craneStatus);
router.post('/assignment', craneAssignment);

export default router;