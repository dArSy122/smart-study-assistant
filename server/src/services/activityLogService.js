import prisma from '../prisma/client.js';

export async function createActivityLog(userId, action, details = null) {
  return prisma.activityLog.create({
    data: {
      userId,
      action,
      details
    }
  });
}