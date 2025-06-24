import api from './api';

// Create Project
export const createProject = (data) => api.post('/projects/create', data);

// Get all projects of logged-in user (paginated)
export const getMyProjects = (page = 1, limit = 10) =>
  api.get(`/projects/my-projects?page=${page}&limit=${limit}`);

// Get project by ID
export const getProjectById = (id) => api.get(`/projects/${id}`);

// Update project
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);

// Delete project
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Get all projects by team
export const getProjectsByTeam = (teamId, page = 1, limit = 10, search = '') =>
  api.get(`/projects/team/${teamId}?page=${page}&limit=${limit}&search=${search}`);

// Assign existing project to a team
export const assignProjectToTeam = (id, teamId) =>
  api.put(`/projects/${id}/assign-team`, { teamId });
