import {
  createTeamService,
  inviteUserService,
  getTeamMembersService,
  getMyInvitesService,
  respondToInviteService,
  getMyTeamsService,
  searchUsersByEmailService
} from '../services/team.service.js';

export const createTeam = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const team = await createTeamService(name, userId);
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const inviteUser = async (req, res) => {
  const { id: teamId } = req.params;
  const { email } = req.body;
  const userId = req.user.userId;

  try {
    const invite = await inviteUserService(teamId, email, userId);
    res.status(200).json(invite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTeamMembers = async (req, res) => {
  try {
    const { id: teamId } = req.params;
    const members = await getTeamMembersService(teamId);
    res.json({
      members: members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        status: m.status,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
};

export const getMyInvites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invites = await getMyInvitesService(userId);
    res.json({ invites });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { teamId } = req.params;

    await respondToInviteService(teamId, userId, 'ACCEPTED');

    res.json({ message: 'Invite accepted' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to accept invite' });
  }
};

export const rejectInvite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { teamId } = req.params;

    await respondToInviteService(teamId, userId, 'REJECTED');

    res.json({ message: 'Invite rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to reject invite' });
  }
};

export const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const teams = await getMyTeamsService(userId);
    res.json({ teams });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

export const searchUsersByEmail = async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.status(400).json({ error: 'Query too short' });

  try {
    const users = await searchUsersByEmailService(q);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
