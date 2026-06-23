import prisma from '../prisma/client.js';
import { successResponse } from '../utils/apiResponse.js';

function calculateAverageScore(attempts) {
  if (!attempts.length) {
    return 0;
  }

  const percentages = attempts.map((attempt) => {
    if (!attempt.totalQuestions) {
      return 0;
    }

    return Math.round((attempt.score / attempt.totalQuestions) * 100);
  });

  const total = percentages.reduce((sum, percentage) => sum + percentage, 0);

  return Math.round(total / percentages.length);
}

function calculateBestScore(attempts) {
  if (!attempts.length) {
    return 0;
  }

  return Math.max(
    ...attempts.map((attempt) => {
      if (!attempt.totalQuestions) {
        return 0;
      }

      return Math.round((attempt.score / attempt.totalQuestions) * 100);
    })
  );
}

function buildScoreChart(attempts) {
  return attempts
    .slice()
    .reverse()
    .map((attempt, index) => ({
      name: `#${index + 1}`,
      score: attempt.totalQuestions
        ? Math.round((attempt.score / attempt.totalQuestions) * 100)
        : 0,
      rawScore: attempt.score,
      totalQuestions: attempt.totalQuestions,
      date: attempt.createdAt
    }));
}

export async function getMyStats(req, res, next) {
  try {
    const userId = req.user.id;

    const [
      totalTopics,
      activeTopics,
      archivedTopics,
      generatedTopics,
      draftTopics,
      foldersCount,
      quizAttempts,
      recentTopics
    ] = await Promise.all([
      prisma.studyTopic.count({
        where: {
          userId
        }
      }),
      prisma.studyTopic.count({
        where: {
          userId,
          status: {
            not: 'ARCHIVED'
          }
        }
      }),
      prisma.studyTopic.count({
        where: {
          userId,
          status: 'ARCHIVED'
        }
      }),
      prisma.studyTopic.count({
        where: {
          userId,
          status: 'GENERATED'
        }
      }),
      prisma.studyTopic.count({
        where: {
          userId,
          status: 'DRAFT'
        }
      }),
      prisma.topicFolder.count({
        where: {
          userId
        }
      }),
      prisma.quizAttempt.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          topic: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      prisma.studyTopic.findMany({
        where: {
          userId
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          language: true,
          updatedAt: true,
          folder: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
    ]);

    const recentAttempts = quizAttempts.slice(0, 8).map((attempt) => ({
      id: attempt.id,
      topicId: attempt.topicId,
      topicTitle: attempt.topic?.title || 'Unknown topic',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.totalQuestions
        ? Math.round((attempt.score / attempt.totalQuestions) * 100)
        : 0,
      createdAt: attempt.createdAt
    }));

    const stats = {
      overview: {
        totalTopics,
        activeTopics,
        archivedTopics,
        generatedTopics,
        draftTopics,
        foldersCount,
        totalQuizAttempts: quizAttempts.length,
        averageQuizScore: calculateAverageScore(quizAttempts),
        bestQuizScore: calculateBestScore(quizAttempts)
      },
      chart: {
        quizScores: buildScoreChart(quizAttempts.slice(0, 10))
      },
      recentAttempts,
      recentTopics
    };

    return successResponse(res, 'Statistics fetched successfully', stats);
  } catch (error) {
    next(error);
  }
}