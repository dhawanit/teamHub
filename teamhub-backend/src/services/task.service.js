import { prisma } from '../prisma/client.js';

const TASK_STATUSES = ['TODO', 'INPROGRESS', 'DONE'];

export const createTaskService = async (data, userId) => {
  const { title, description, projectId, dueDate, assigneeId } = data;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) throw new Error('Project not found');

  if (project.teamId) {
    const isTeamMember = await prisma.teamMember.findFirst({
      where: {
        teamId: project.teamId,
        userId,
        status: 'ACCEPTED',
      },
    });
    if (!isTeamMember) throw new Error('Only team members can create task in this project');
  } else {
    if (project.createdBy !== userId) {
      throw new Error('Only project creator can create task');
    }
  }


  const task = await prisma.task.create({
    data: {
      title,
      description,
      projectId,
      dueDate,
      createdBy: userId,
      assigneeId: assigneeId?? null
    },
  });

  await prisma.taskHistory.create({
    data: {
      taskId: task.id,
      changedBy: userId,
      fromStatus: null,
      toStatus: 'TODO',
    },
  });

  return task;
};

export const assignTaskService = async (taskId, assigneeId, requesterId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });
  if (!task) throw new Error('Task not found');

  const project = task.project;

  const requesterIsTeamMember = project.teamId
    ? await prisma.teamMember.findFirst({
        where: {
          teamId: project.teamId,
          userId: requesterId,
          status: 'ACCEPTED',
        },
      })
    : project.createdBy === requesterId;

  if (!requesterIsTeamMember) throw new Error('You are not allowed to assign task');

  const assigneeIsTeamMember = project.teamId
    ? await prisma.teamMember.findFirst({
        where: {
          teamId: project.teamId,
          userId: assigneeId,
          status: 'ACCEPTED',
        },
      })
    : assigneeId === requesterId;

  if (!assigneeIsTeamMember) throw new Error('Assignee must be part of the project team');

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { assigneeId },
  });

  await prisma.taskHistory.create({
    data: {
      taskId,
      changedBy: requesterId,
      fromStatus: task.status,
      toStatus: task.status,
    },
  });

  return updatedTask;
};

export const updateTaskStatusService = async (taskId, newStatus, userId) => {
  if (!TASK_STATUSES.includes(newStatus)) {
    throw new Error('Invalid task status');
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error('Task not found');

  if (task.createdBy !== userId && task.assigneeId !== userId) {
    throw new Error('Only task creator or assignee can update status');
  }

  // 🚫 If the status is same, skip update and history
  if (task.status === newStatus) {
    return task; // No change needed
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  await prisma.taskHistory.create({
    data: {
      taskId,
      changedBy: userId,
      fromStatus: task.status,
      toStatus: newStatus,
    },
  });

  return updatedTask;
};

export const addCommentToTaskService = async (taskId, content, authorId) => {
  const comment = await prisma.comment.create({
    data: {
      taskId,
      content,
      authorId,
    },
  });

  const task = await prisma.task.findUnique({ where: { id: taskId } });

  await prisma.taskHistory.create({
    data: {
      taskId,
      changedBy: authorId,
      fromStatus: task.status,
      toStatus: task.status,
    },
  });

  return comment;
};

export const getTaskFullHistoryService = async (taskId) => {
  // Fetch status change history
  const statusHistory = await prisma.taskHistory.findMany({
    where: { taskId },
    select: {
      changedAt: true,
      fromStatus: true,
      toStatus: true,
      taskId: true,
      user: {
        select: { name: true, email: true }
      },
      changedBy: true
    },
  });

  // Fetch comments
  const comments = await prisma.comment.findMany({
    where: { taskId },
    select: {
      content: true,
      createdAt: true,
      author: {
        select: { name: true, email: true }
      },
      authorId: true
    },
  });

  // Merge and sort both by timestamp (descending)
  const combined = [
    ...statusHistory.map(entry => ({
      type: 'status',
      timestamp: entry.changedAt,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
      user: entry.user,
    })),
    ...comments.map(entry => ({
      type: 'comment',
      timestamp: entry.createdAt,
      content: entry.content,
      user: entry.author,
    }))
  ];

  return combined.sort((a, b) => b.timestamp - a.timestamp);
};

export const listTasksService = async ({ status, projectId, page, limit }) => {
  const where = {};
  if (status) where.status = status;
  if (projectId) where.projectId = projectId;

  return prisma.task.findMany({
    where,
    skip: (page - 1) * limit,
    take: +limit,
    include: {
      assignee: { select: { name: true } },
      project: { select: { name: true } },
      creator: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateTaskService = async (taskId, data, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) throw new Error('Task not found');

  const isCreator = task.createdBy === userId;
  const isAssignee = task.assigneeId === userId;

  if (!isCreator && !isAssignee) {
    throw new Error('Only the creator or assignee can update this task');
  }

  const updateData = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);
  if (!TASK_STATUSES.includes(data.status)) {
    throw new Error('Invalid task status');
  }
  if (data.status !== task.status) updateData.status = data.status;


  if (data.assigneeId !== undefined && data.assigneeId.length > 0) {
    if (task.project.teamId) {
      const validAssignee = await prisma.teamMember.findFirst({
        where: {
          teamId: task.project.teamId,
          userId: data.assigneeId,
          status: 'ACCEPTED',
        },
      });
      if (!validAssignee) throw new Error('Assignee must be an active team member');
    } else {
      if (data.assigneeId !== task.project.createdBy) {
        throw new Error('Assignee must be the project creator for solo projects');
      }
    }
    updateData.assigneeId = data.assigneeId;
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  return updatedTask;
};
