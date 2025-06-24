import api from './api';

const tokenHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const taskService = {
  // 🚀 Create a new task
  createTask: (data) => api.post('/tasks/create', data, tokenHeader()),

  // 🔄 Update task status
  updateStatus: (taskId, status) =>
    api.put(`/tasks/update-status/${taskId}`, { status }, tokenHeader()),

  // 👤 Assign task to a user
  assignTask: (taskId, assigneeId) =>
    api.put(`/tasks/assign/${taskId}`, { assigneeId }, tokenHeader()),

  // 📝 Add comment to a task
  addComment: (taskId, content) =>
    api.post(`/tasks/comment/${taskId}`, { content }, tokenHeader()),

  // 🕓 Get full task history (status + comments)
  getHistory: (taskId) => api.get(`/tasks/history/${taskId}`, tokenHeader()),

  // 📋 List tasks with optional filters
  listTasks: (params) => api.get('/tasks', { params, ...tokenHeader() }),

  // 📄 Get task by ID
  getTaskById: (taskId) => api.get(`/tasks/${taskId}`, tokenHeader()),

  // ❌ Delete task (if allowed)
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`, tokenHeader()),

  // ✏️ Update task (title, desc, dueDate, assignee, status)
  updateTaskDetails: (taskId, data) =>
    api.put(`/tasks/${taskId}`, data, tokenHeader()),
};

export default taskService;
