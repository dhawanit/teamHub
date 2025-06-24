// routes/dashboard.routes.js
import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/summary', authenticate, getDashboardStats);

export default router;
