import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByTeam,
  assignProjectToTeam,
  getProjectMembers
} from '../controllers/project.controller.js';

const router = express.Router();

router.post('/create', authenticate, createProject);
router.get('/my-projects', authenticate, getMyProjects);
router.get('/:id', authenticate, getProjectById);
router.put('/:id', authenticate, updateProject);
router.delete('/:id', authenticate, deleteProject);
router.get('/team/:teamId', authenticate, getProjectsByTeam);
router.put('/:projectId/assign-team', authenticate, assignProjectToTeam);
router.get('/:id/members', authenticate, getProjectMembers);


export default router;
