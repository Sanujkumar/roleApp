import { Router } from 'express';
import { RecordController } from '../controllers/record.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const recordController = new RecordController();

router.get('/', authenticate, (req, res) => recordController.getAll(req, res));

export default router;
