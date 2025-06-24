import {
  createTaskService,
  assignTaskService,
  updateTaskStatusService,
  addCommentToTaskService,
  getTaskFullHistoryService,
  listTasksService,
  updateTaskService
} from '../services/task.service.js';

export const createTask = async (req, res) => {
  try {
    const task = await createTaskService(req.body, req.user.userId);
    res.json({ task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assigneeId } = req.body;
    const task = await assignTaskService(taskId, assigneeId, req.user.userId);
    res.json({ task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const updatedTask = await updateTaskStatusService(taskId, status, req.user.userId);
    res.json({ task: updatedTask });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const addCommentToTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const comment = await addCommentToTaskService(taskId, content, req.user.userId);
    res.json({ comment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getTaskHistory = async (req, res) => {
  const { taskId } = req.params;
  try {
    const history = await getTaskFullHistoryService(taskId);
    res.json({ history });
  } catch (err) {
    console.error('Error fetching task history:', err);
    res.status(500).json({ error: 'Failed to fetch task history' });
  }
};


export const listTasks = async (req, res) => {
  try {
    const { status, projectId, page = 1, limit = 10 } = req.query;
    const tasks = await listTasksService({ status, projectId, page, limit });
    res.json({ tasks });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const updateTaskDetails = async (req, res) => {
  try {
    const updatedTask = await updateTaskService(req.params.id, req.body, req.user.userId);
    res.json({ task: updatedTask });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Failed to update task' });
  }
};