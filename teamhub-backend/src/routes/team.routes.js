import express from 'express';
import {
  createTeam,
  inviteUser,
  getTeamMembers,
  getMyInvites,
  acceptInvite,
  rejectInvite,
  getMyTeams,
  searchUsersByEmail
} from '../controllers/team.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authenticate, createTeam);
router.post('/send-invite/:id', authenticate, inviteUser);
router.get('/get-team-members/:id', authenticate, getTeamMembers);
router.get('/my-invites', authenticate, getMyInvites);
router.post('/accept-invite/:teamId', authenticate, acceptInvite);
router.post('/reject-invite/:teamId', authenticate, rejectInvite);
router.get('/my-teams', authenticate, getMyTeams);
router.get('/users/search', authenticate, searchUsersByEmail);


export default router;
