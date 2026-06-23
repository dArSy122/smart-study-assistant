import prisma from '../prisma/client.js';
import { successResponse } from '../utils/apiResponse.js';
import { createTopicSchema, topicIdSchema, updateTopicSchema } from '../utils/validators.js';
import { createActivityLog } from '../services/activityLogService.js';

function validateTopicId(req) {
  const validationResult = topicIdSchema.safeParse(req.params);

  if (!validationResult.success) {
    const error = new Error('Invalid topic id');
    error.statusCode = 400;
    error.errors = validationResult.error.flatten();
    throw error;
  }

  return validationResult.data.id;
}

async function findUserTopic(topicId, userId) {
  return prisma.studyTopic.findFirst({
    where: {
      id: topicId,
      userId
    },
    include: {
      aiResult: true,
      quizAttempts: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

export async function getTopics(req, res, next) {
  try {
    const topics = await prisma.studyTopic.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
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

    return successResponse(res, 'Topics loaded successfully', {
      topics
    });
  } catch (error) {
    return next(error);
  }
}

export async function createTopic(req, res, next) {
  try {
    const validationResult = createTopicSchema.safeParse(req.body);

    if (!validationResult.success) {
      const error = new Error('Invalid topic data');
      error.statusCode = 400;
      error.errors = validationResult.error.flatten();
      return next(error);
    }

    const { title, originalText, ocrText, finalText, language } = validationResult.data;

    const topic = await prisma.studyTopic.create({
      data: {
        userId: req.user.id,
        title,
        originalText: originalText || '',
        ocrText: ocrText || '',
        finalText: finalText || originalText || ocrText || '',
        language,
        status: 'DRAFT'
      }
    });

    await createActivityLog(req.user.id, 'TOPIC_CREATED', {
      topicId: topic.id,
      title: topic.title
    });

    return successResponse(
      res,
      'Topic created successfully',
      {
        topic
      },
      201
    );
  } catch (error) {
    return next(error);
  }
}

export async function getTopicById(req, res, next) {
  try {
    const topicId = validateTopicId(req);

    const topic = await findUserTopic(topicId, req.user.id);

    if (!topic) {
      const error = new Error('Topic was not found');
      error.statusCode = 404;
      return next(error);
    }

    return successResponse(res, 'Topic loaded successfully', {
      topic
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);

    const existingTopic = await prisma.studyTopic.findFirst({
      where: {
        id: topicId,
        userId: req.user.id
      }
    });

    if (!existingTopic) {
      const error = new Error('Topic was not found');
      error.statusCode = 404;
      return next(error);
    }

    const validationResult = updateTopicSchema.safeParse(req.body);

    if (!validationResult.success) {
      const error = new Error('Invalid topic update data');
      error.statusCode = 400;
      error.errors = validationResult.error.flatten();
      return next(error);
    }

    const updatedTopic = await prisma.studyTopic.update({
      where: {
        id: topicId
      },
      data: validationResult.data
    });

    await createActivityLog(req.user.id, 'TOPIC_UPDATED', {
      topicId: updatedTopic.id,
      title: updatedTopic.title
    });

    return successResponse(res, 'Topic updated successfully', {
      topic: updatedTopic
    });
  } catch (error) {
    return next(error);
  }
}

export async function archiveTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);

    const existingTopic = await prisma.studyTopic.findFirst({
      where: {
        id: topicId,
        userId: req.user.id
      }
    });

    if (!existingTopic) {
      const error = new Error('Topic was not found');
      error.statusCode = 404;
      return next(error);
    }

    const archivedTopic = await prisma.studyTopic.update({
      where: {
        id: topicId
      },
      data: {
        status: 'ARCHIVED'
      }
    });

    await createActivityLog(req.user.id, 'TOPIC_ARCHIVED', {
      topicId: archivedTopic.id,
      title: archivedTopic.title
    });

    return successResponse(res, 'Topic archived successfully', {
      topic: archivedTopic
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);

    const existingTopic = await prisma.studyTopic.findFirst({
      where: {
        id: topicId,
        userId: req.user.id
      }
    });

    if (!existingTopic) {
      const error = new Error('Topic was not found');
      error.statusCode = 404;
      return next(error);
    }

    await prisma.studyTopic.delete({
      where: {
        id: topicId
      }
    });

    await createActivityLog(req.user.id, 'TOPIC_DELETED', {
      topicId,
      title: existingTopic.title
    });

    return successResponse(res, 'Topic deleted successfully', {
      topicId
    });
  } catch (error) {
    return next(error);
  }
}