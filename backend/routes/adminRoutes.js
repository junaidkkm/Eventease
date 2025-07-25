import express from 'express';
import { getAdminEarnings } from '../controllers/adminController.js';

const router = express.Router();

router.get('/earnings', getAdminEarnings);

export default router;
