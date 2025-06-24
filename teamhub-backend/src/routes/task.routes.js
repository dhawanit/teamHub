import express from 'express';
import {
  createTask,
  assignTask,
  updateTaskStatus,
  addCommentToTask,
  getTaskHistory,
  listTasks,
  updateTaskDetails
} from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticate, createTask);
router.put('/assign/:taskId', authenticate, assignTask);
router.put('/update-status/:taskId', authenticate, updateTaskStatus);
router.put('/:id', authenticate, updateTaskDetails);
router.post('/comment/:taskId', authenticate, addCommentToTask);
router.get('/history/:taskId', authenticate, getTaskHistory);
router.get('/', authenticate, listTasks);


export default router;
