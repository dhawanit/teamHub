import { prisma } from '../prisma/client.js';

export const createProjectService = async ({ name, description, teamId, userId }) => {
  
  if (teamId && teamId.length > 0) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: { where: { userId, status: 'ACCEPTED' } },
      },
    });
    if (!team || team.members.length === 0) {
      throw new Error('You must be a member of the team to assign project');
    }
  }

  return prisma.project.create({
    data: {
      name,
      description,
      teamId,
      createdBy: userId,
    },
  });
};

export const getMyProjectsService = async (userId, page, limit) => {
  return prisma.project.findMany({
    where: { createdBy: userId },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
};

export const getProjectByIdService = async (id) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error('Project not found');
  return project;
};

export const updateProjectService = async (id, data, userId) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error('Project not found');
  if (project.createdBy !== userId) throw new Error('Not authorized to update this project');

  if (data.teamId && data.teamId.length > 0) {
    const team = await prisma.team.findUnique({
      where: { id: data.teamId },
      include: {
        members: { where: { userId, status: 'ACCEPTED' } },
      },
    });
    if (!team || team.members.length === 0) {
      throw new Error('You must be a member of the new team to assign project');
    }
  }

  return prisma.project.update({
    where: { id },
    data,
  });
};

export const deleteProjectService = async (id, userId) => {
  const taskCount = await prisma.task.count({
    where: { projectId: id },
  });

  if (taskCount > 0) {
    throw new Error('Cannot delete project: It has Pending Tasks associated with it. Please Close the pending tickets before deleting a project');
  }
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error('Project not found');
  if (project.createdBy !== userId) throw new Error('Not authorized to delete this project');
  return prisma.project.delete({ where: { id } });
};

export const getProjectsByTeamService = async (teamId, userId, page, limit, search) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: { where: { userId, status: 'ACCEPTED' } },
    },
  });
  if (!team || team.members.length === 0) {
    throw new Error('Not authorized to view this team projects');
  }

  return prisma.project.findMany({
    where: {
      teamId,
      name: { contains: search, mode: 'insensitive' },
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
};

export const assignProjectToTeamService = async (projectId, teamId, userId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error('Project not found');

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error('Team not found');


  // Check if the user is a member of the team
  const member = await prisma.teamMember.findFirst({
    where: { teamId, userId, status: 'ACCEPTED' },
  });
  if (!member) throw new Error('You are not a member of this team');

  return prisma.project.update({
    where: { id: projectId },
    data: { teamId },
  });
};

export const getProjectMembersService = async (projectId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      team: true,
      creator: true,
    },
  });

  if (!project) throw new Error('Project not found');

  if (project.teamId) {
    // Team assigned: get accepted members
    const members = await prisma.teamMember.findMany({
      where: {
        teamId: project.teamId,
        status: 'ACCEPTED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return members;
  } else {
    // No team: return project creator
    return [
      {
        user: {
          id: project.creator.id,
          name: project.creator.name,
          email: project.creator.email,
        },
        status: 'CREATOR',
      },
    ];
  }
};
