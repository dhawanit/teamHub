import express from 'express';
import { signup, login, getUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/getuser', authenticate, getUser); // Protected route


export default router;
