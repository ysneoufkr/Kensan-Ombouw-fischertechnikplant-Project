import { Router } from 'express';
import { warehouseStatus } from '../controllers/warehouseController';

const router = Router();

router.get('/status', warehouseStatus);

export default router;