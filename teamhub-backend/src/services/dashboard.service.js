import { prisma } from '../prisma/client.js';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

export const getDashboardSummaryService = async (userId) => {
  // Basic counts
  const [projectCount, taskCount, teamCount] = await Promise.all([
    prisma.project.count({ where: { createdBy: userId } }),
    prisma.task.count({
      where: {
        OR: [{ createdBy: userId }, { assigneeId: userId }],
      },
    }),
    prisma.teamMember.count({ where: { userId, status: 'ACCEPTED' } }),
  ]);

  // Weekly task distribution based on dueDate
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const dayMap = allDays.reduce((acc, date) => {
    acc[format(date, 'EEE')] = 0;
    return acc;
  }, {});

  const weeklyTasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gte: weekStart,
        lte: weekEnd,
      },
      OR: [{ createdBy: userId }, { assigneeId: userId }],
    },
    select: {
      dueDate: true,
    },
  });

  weeklyTasks.forEach((task) => {
    const day = format(new Date(task.dueDate), 'EEE');
    if (dayMap[day] !== undefined) {
      dayMap[day]++;
    }
  });

  const weeklyTaskChart = Object.entries(dayMap).map(([day, count]) => ({
    day,
    count,
  }));

  // Task status distribution
  const statusGroups = await prisma.task.groupBy({
    by: ['status'],
    _count: true,
    where: {
      OR: [{ createdBy: userId }, { assigneeId: userId }],
    },
  });

  const statusChart = statusGroups.map((s) => ({
    status: s.status,
    count: s._count,
  }));

  return {
    projects: projectCount,
    tasks: taskCount,
    teams: teamCount,
    weeklyTaskChart,
    statusChart,
  };
};
