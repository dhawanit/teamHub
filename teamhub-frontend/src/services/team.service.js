import api from './api';

// Headers helper
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// ✅ Create Team
export const createTeam = async (payload) => {
  return api.post('/teams/create', payload, authHeader());
};

// ✅ Get My Teams (created or joined with status = ACCEPTED)
export const getMyTeams = async () => {
  return api.get('/teams/my-teams', authHeader());
};

// ✅ Send Invite to Team (POST /teams/send-invite/:teamId)
export const sendInviteToUser = async (teamId, payload) => {
  return api.post(`/teams/send-invite/${teamId}`, payload, authHeader());
};

// ✅ Get Team Members by Team ID
export const getTeamMembers = async (teamId) => {
  return api.get(`/teams/get-team-members/${teamId}`, authHeader());
};

// ✅ Get My Pending Invites
export const getMyPendingInvites = async () => {
  return api.get('/teams/my-invites', authHeader());
};

// ✅ Respond to Invite (Accept/Reject)
export const respondToInvite = async (inviteId, action) => {
  return api.post(`/teams/respond-invite/${inviteId}`, { action }, authHeader());
};

// ✅ Delete Team (if implemented)
export const deleteTeam = async (teamId) => {
  return api.delete(`/teams/${teamId}`, authHeader());
};

// ✅ Update Team (optional if supported)
export const updateTeam = async (teamId, payload) => {
  return api.put(`/teams/${teamId}`, payload, authHeader());
};
