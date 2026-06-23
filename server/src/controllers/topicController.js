import prisma from '../prisma/client.js';
import { createActivityLog } from '../services/activityLogService.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  createTopicSchema,
  topicIdSchema,
  updateTopicSchema
} from '../utils/validators.js';

function validateTopicId(req) {
  const parsedParams = topicIdSchema.safeParse(req.params);

  if (!parsedParams.success) {
    const error = new Error(parsedParams.error.issues[0].message);
    error.statusCode = 400;
    throw error;
  }

  return parsedParams.data.id;
}

async function ensureUserFolder(folderId, userId) {
  if (!folderId) {
    return null;
  }

  const folder = await prisma.topicFolder.findFirst({
    where: {
      id: folderId,
      userId
    }
  });

  if (!folder) {
    const error = new Error('Selected folder was not found.');
    error.statusCode = 404;
    throw error;
  }

  return folder;
}

async function findUserTopic(topicId, userId) {
  return prisma.studyTopic.findFirst({
    where: {
      id: topicId,
      userId
    },
    include: {
      folder: {
        select: {
          id: true,
          name: true,
          color: true
        }
      },
      aiResult: true,
      quizAttempts: {
        select: {
          id: true,
          score: true,
          totalQuestions: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

function buildTopicWhere(req) {
  const where = {
    userId: req.user.id
  };

  const status = req.query.status || 'active';

  if (status === 'archived') {
    where.status = 'ARCHIVED';
  } else if (status === 'all') {
    // no status filter
  } else {
    where.status = {
      not: 'ARCHIVED'
    };
  }

  if (req.query.folderId === 'unassigned') {
    where.folderId = null;
  } else if (req.query.folderId) {
    where.folderId = Number(req.query.folderId);
  }

  return where;
}

export async function getTopics(req, res, next) {
  try {
    const topics = await prisma.studyTopic.findMany({
      where: buildTopicWhere(req),
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        aiResult: true,
        quizAttempts: {
          select: {
            id: true,
            score: true,
            totalQuestions: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return successResponse(res, 'Topics fetched successfully', { topics });
  } catch (error) {
    next(error);
  }
}

export async function createTopic(req, res, next) {
  try {
    const parsedBody = createTopicSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = new Error(parsedBody.error.issues[0].message);
      error.statusCode = 400;
      throw error;
    }

    await ensureUserFolder(parsedBody.data.folderId, req.user.id);

    const topic = await prisma.studyTopic.create({
      data: {
        userId: req.user.id,
        title: parsedBody.data.title,
        originalText: parsedBody.data.originalText || '',
        ocrText: parsedBody.data.ocrText || '',
        finalText: parsedBody.data.finalText || parsedBody.data.originalText || parsedBody.data.ocrText || '',
        language: parsedBody.data.language,
        folderId: parsedBody.data.folderId || null,
        status: 'DRAFT'
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        aiResult: true,
        quizAttempts: true
      }
    });

    await createActivityLog(req.user.id, 'TOPIC_CREATED', {
      topicId: topic.id,
      title: topic.title,
      folderId: topic.folderId
    });

    return successResponse(res, 'Topic created successfully', { topic }, 201);
  } catch (error) {
    next(error);
  }
}

export async function getTopicById(req, res, next) {
  try {
    const topicId = validateTopicId(req);
    const topic = await findUserTopic(topicId, req.user.id);

    if (!topic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    return successResponse(res, 'Topic fetched successfully', { topic });
  } catch (error) {
    next(error);
  }
}

export async function updateTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);

    const existingTopic = await findUserTopic(topicId, req.user.id);

    if (!existingTopic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    const parsedBody = updateTopicSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = new Error(parsedBody.error.issues[0].message);
      error.statusCode = 400;
      throw error;
    }

    if (Object.prototype.hasOwnProperty.call(parsedBody.data, 'folderId')) {
      await ensureUserFolder(parsedBody.data.folderId, req.user.id);
    }

    const topic = await prisma.studyTopic.update({
      where: {
        id: topicId
      },
      data: parsedBody.data,
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        aiResult: true,
        quizAttempts: true
      }
    });

    await createActivityLog(req.user.id, 'TOPIC_UPDATED', {
      topicId: topic.id,
      title: topic.title,
      folderId: topic.folderId
    });

    return successResponse(res, 'Topic updated successfully', { topic });
  } catch (error) {
    next(error);
  }
}

export async function archiveTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);
    const existingTopic = await findUserTopic(topicId, req.user.id);

    if (!existingTopic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    const topic = await prisma.studyTopic.update({
      where: {
        id: topicId
      },
      data: {
        status: 'ARCHIVED'
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        aiResult: true,
        quizAttempts: true
      }
    });

    await createActivityLog(req.user.id, 'TOPIC_ARCHIVED', {
      topicId: topic.id,
      title: topic.title,
      folderId: topic.folderId
    });

    return successResponse(res, 'Topic archived successfully', { topic });
  } catch (error) {
    next(error);
  }
}

export async function restoreTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);
    const existingTopic = await findUserTopic(topicId, req.user.id);

    if (!existingTopic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    const topic = await prisma.studyTopic.update({
      where: {
        id: topicId
      },
      data: {
        status: 'DRAFT'
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        aiResult: true,
        quizAttempts: true
      }
    });

    await createActivityLog(req.user.id, 'TOPIC_RESTORED', {
      topicId: topic.id,
      title: topic.title,
      folderId: topic.folderId
    });

    return successResponse(res, 'Topic restored successfully', { topic });
  } catch (error) {
    next(error);
  }
}

export async function deleteTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);
    const existingTopic = await findUserTopic(topicId, req.user.id);

    if (!existingTopic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    await prisma.studyTopic.delete({
      where: {
        id: topicId
      }
    });

    await createActivityLog(req.user.id, 'TOPIC_DELETED', {
      topicId,
      title: existingTopic.title,
      folderId: existingTopic.folderId
    });

    return successResponse(res, 'Topic deleted successfully', { topicId });
  } catch (error) {
    next(error);
  }
}