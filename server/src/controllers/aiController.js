import prisma from '../prisma/client.js';
import { createActivityLog } from '../services/activityLogService.js';
import { generateAiMaterials } from '../services/aiService.js';
import { successResponse } from '../utils/apiResponse.js';
import { topicIdSchema } from '../utils/validators.js';

function validateTopicId(req) {
  const parsedParams = topicIdSchema.safeParse(req.params);

  if (!parsedParams.success) {
    const error = new Error(parsedParams.error.issues[0].message);
    error.statusCode = 400;
    throw error;
  }

  return parsedParams.data.id;
}

async function findTopicForUser(topicId, userId) {
  return prisma.studyTopic.findFirst({
    where: {
      id: topicId,
      userId
    },
    include: {
      aiResult: true
    }
  });
}

export async function generateAiForTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);

    const topic = await findTopicForUser(topicId, req.user.id);

    if (!topic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    const studyText = topic.finalText || topic.ocrText || topic.originalText;

    if (!studyText || studyText.trim().length < 20) {
      const error = new Error('Topic needs more text before AI generation.');
      error.statusCode = 400;
      throw error;
    }

    const materials = await generateAiMaterials({
      title: topic.title,
      text: studyText,
      language: topic.language
    });

    const aiResult = await prisma.aIResult.upsert({
      where: {
        topicId: topic.id
      },
      create: {
        topicId: topic.id,
        summary: materials.summary,
        keyTerms: materials.keyTerms,
        studyPlan: materials.studyPlan,
        flashcardsJson: materials.flashcards,
        quizJson: materials.quiz
      },
      update: {
        summary: materials.summary,
        keyTerms: materials.keyTerms,
        studyPlan: materials.studyPlan,
        flashcardsJson: materials.flashcards,
        quizJson: materials.quiz
      }
    });

    const updatedTopic = await prisma.studyTopic.update({
      where: {
        id: topic.id
      },
      data: {
        status: 'GENERATED'
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

    await createActivityLog(req.user.id, 'AI_GENERATED', {
      topicId: topic.id,
      title: topic.title
    });

    return successResponse(res, 'AI materials generated successfully', {
      aiResult,
      topic: updatedTopic
    });
  } catch (error) {
    next(error);
  }
}