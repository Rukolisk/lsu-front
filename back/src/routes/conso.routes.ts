import { Router } from 'express';
import {
  createConso,
  getConso,
  getConsoByUser,
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats
} from '../controllers/conso.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createConso);
router.get('/', authMiddleware, getConso);
router.get('/user', authMiddleware, getConsoByUser);
router.get('/summary/today', getDailyStats);
router.get('/summary/week', authMiddleware, getWeeklyStats);
router.get('/summary/month', authMiddleware, getMonthlyStats);

export default router;
