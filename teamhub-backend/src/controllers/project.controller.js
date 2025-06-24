import {
  createProjectService,
  getMyProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  getProjectsByTeamService,
  assignProjectToTeamService,
  getProjectMembersService
} from '../services/project.service.js';

export const createProject = async (req, res) => {
  try {
    const { name, description, teamId } = req.body;
    const userId = req.user.userId;
    const project = await createProjectService({ name, description, teamId, userId });
    res.status(201).json({ project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const projects = await getMyProjectsService(userId, parseInt(page), parseInt(limit));
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getProjectByIdService(id);
    res.json({ project });
  } catch (err) {
    res.status(404).json({ error: 'Project not found' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updated = await updateProjectService(id, req.body, userId);
    res.json({ updated });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    await deleteProjectService(id, userId);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const getProjectsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user.userId;
    const { page = 1, limit = 10, search = '' } = req.query;
    const projects = await getProjectsByTeamService(teamId, userId, parseInt(page), parseInt(limit), search);
    res.json({ projects });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const assignProjectToTeam = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { teamId } = req.body;
    const userId = req.user.userId;

    if (!teamId) {
      return res.status(400).json({ error: 'teamId is required' });
    }

    const updated = await assignProjectToTeamService(projectId, teamId, userId);
    res.json({ project: updated });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to assign team' });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const members = await getProjectMembersService(id);
    res.json({ members });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch project members' });
  }
};
