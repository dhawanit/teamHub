import { prisma } from '../prisma/client.js';

export const createTeamService = async (name, userId) => {
  try {
    const exists = await prisma.team.findFirst({ where: { name } });
    if (exists) throw new Error('Team name already exists');

    const team = await prisma.team.create({
      data: {
        name,
        createdBy: userId,
        members: {
          create: {
            userId,
            status: 'ACCEPTED' // Automatically accept the creator as a member
          },
        },
      },
    });
    return team;
  } catch (err) {
    throw new Error(err.message || 'Failed to create team');
  }
};

export const inviteUserService = async (teamId, email, inviterId) => {
  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error('Team not found');

  // Check if the inviter is either the creator or an accepted team member
  const inviterMembership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: inviterId,
      status: 'ACCEPTED'
    }
  });

  const isTeamCreator = team.createdBy === inviterId;

  if (!isTeamCreator && !inviterMembership) {
    throw new Error('Only accepted team members or team creator can invite others');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User with this email not found');

  if (user.id === inviterId) {
    throw new Error('You cannot invite yourself');
  }

  const alreadyMember = await prisma.teamMember.findFirst({
    where: { teamId, userId: user.id },
  });
  if (alreadyMember) throw new Error('User already in team');

  return prisma.teamMember.create({
    data: {
      teamId,
      userId: user.id,
    },
  });
};

export const getTeamMembersService = async (teamId) => {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!team) throw new Error('Team not found');

  return team.members.map((m) => ({
    user: m.user,
    status: m.status,
  }));
};

export const getMyInvitesService = async (userId) => {
  const invites = await prisma.teamMember.findMany({
    where: {
      userId,
      status: 'PENDING',
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
      inviter: {
        select: { id: true, name: true, email: true },
      }
    },
  });
  return invites;
};

export const respondToInviteService = async (teamId, userId, status) => {
  const invite = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId,
      status: 'PENDING',
    },
  });
  if (!invite) throw new Error('Invite not found or already responded to');

  return prisma.teamMember.update({
    where: {
      id: invite.id,
    },
    data: {
      status,
    },
  });
};

export const getMyTeamsService = async (userId) => {
  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
          status: 'ACCEPTED'
        }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return teams;
};

export const searchUsersByEmailService = async (query) => {
  return prisma.user.findMany({
    where: {
      email: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: 10,
  });
};
