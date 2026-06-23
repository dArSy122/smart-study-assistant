import prisma from '../prisma/client.js';
import { generateDifferentQuizForTopic } from '../services/aiService.js';
import { createActivityLog } from '../services/activityLogService.js';
import { successResponse } from '../utils/apiResponse.js';
import { submitQuizAttemptSchema, topicIdSchema } from '../utils/validators.js';

function validateTopicId(req) {
  const parsedParams = topicIdSchema.safeParse(req.params);

  if (!parsedParams.success) {
    const error = new Error(parsedParams.error.issues[0].message);
    error.statusCode = 400;
    throw error;
  }

  return parsedParams.data.id;
}

async function findTopicWithQuiz(topicId, userId) {
  return prisma.studyTopic.findFirst({
    where: {
      id: topicId,
      userId
    },
    include: {
      aiResult: true,
      quizAttempts: {
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

function getQuizQuestions(topic) {
  const quiz = topic.aiResult?.quizJson;

  if (!Array.isArray(quiz) || quiz.length === 0) {
    return [];
  }

  return quiz;
}

function toSafeQuiz(quiz) {
  return quiz.map((question, index) => ({
    questionIndex: index,
    question: question.question,
    options: Array.isArray(question.options) ? question.options : [],
    order: question.order || index + 1
  }));
}

async function generateNextQuiz(topic, previousQuiz) {
  const studyText = topic.finalText || topic.ocrText || topic.originalText;

  if (!studyText || !topic.aiResult) {
    return null;
  }

  const nextQuiz = await generateDifferentQuizForTopic({
    title: topic.title,
    text: studyText,
    language: topic.language,
    previousQuiz
  });

  await prisma.aIResult.update({
    where: {
      topicId: topic.id
    },
    data: {
      quizJson: nextQuiz
    }
  });

  return nextQuiz;
}

export async function getQuizForTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);
    const topic = await findTopicWithQuiz(topicId, req.user.id);

    if (!topic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    const quiz = getQuizQuestions(topic);

    if (quiz.length === 0) {
      const error = new Error('No quiz was generated for this topic yet.');
      error.statusCode = 404;
      throw error;
    }

    return successResponse(res, 'Quiz fetched successfully', {
      topic: {
        id: topic.id,
        title: topic.title,
        language: topic.language,
        status: topic.status
      },
      quiz: toSafeQuiz(quiz),
      latestAttempt: topic.quizAttempts[0] || null
    });
  } catch (error) {
    next(error);
  }
}

export async function submitQuizForTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);
    const parsedBody = submitQuizAttemptSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = new Error(parsedBody.error.issues[0].message);
      error.statusCode = 400;
      throw error;
    }

    const topic = await findTopicWithQuiz(topicId, req.user.id);

    if (!topic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    const quiz = getQuizQuestions(topic);

    if (quiz.length === 0) {
      const error = new Error('No quiz was generated for this topic yet.');
      error.statusCode = 404;
      throw error;
    }

    const submittedAnswers = parsedBody.data.answers;
    let score = 0;

    const review = quiz.map((question, index) => {
      const submittedAnswer = submittedAnswers.find((answer) => answer.questionIndex === index);
      const selectedAnswerIndex = submittedAnswer ? submittedAnswer.selectedAnswerIndex : null;
      const correctAnswerIndex = Number(question.correctAnswerIndex);
      const isCorrect = selectedAnswerIndex === correctAnswerIndex;

      if (isCorrect) {
        score += 1;
      }

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        selectedAnswerIndex,
        correctAnswerIndex,
        isCorrect,
        explanation: question.explanation || ''
      };
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        topicId: topic.id,
        score,
        totalQuestions: quiz.length,
        answersJson: review
      }
    });

    await createActivityLog(req.user.id, 'QUIZ_ATTEMPT_CREATED', {
      topicId: topic.id,
      quizAttemptId: attempt.id,
      score,
      totalQuestions: quiz.length
    });

    let nextQuizGenerated = false;

    try {
      await generateNextQuiz(topic, quiz);
      nextQuizGenerated = true;

      await createActivityLog(req.user.id, 'QUIZ_REGENERATED', {
        topicId: topic.id
      });
    } catch (generationError) {
      console.warn('Next quiz generation failed:', generationError.message);
    }

    return successResponse(res, 'Quiz submitted successfully', {
      attempt,
      review,
      nextQuizGenerated
    }, 201);
  } catch (error) {
    next(error);
  }
}

export async function getQuizAttemptsForTopic(req, res, next) {
  try {
    const topicId = validateTopicId(req);

    const topic = await prisma.studyTopic.findFirst({
      where: {
        id: topicId,
        userId: req.user.id
      },
      select: {
        id: true,
        title: true
      }
    });

    if (!topic) {
      const error = new Error('Topic was not found.');
      error.statusCode = 404;
      throw error;
    }

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        topicId,
        userId: req.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return successResponse(res, 'Quiz attempts fetched successfully', {
      topic,
      attempts
    });
  } catch (error) {
    next(error);
  }
}