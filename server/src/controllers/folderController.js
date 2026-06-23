import prisma from '../prisma/client.js';
import { createActivityLog } from '../services/activityLogService.js';
import { successResponse } from '../utils/apiResponse.js';
import {
  createFolderSchema,
  folderIdSchema,
  updateFolderSchema
} from '../utils/validators.js';

function validateFolderId(req) {
  const parsedParams = folderIdSchema.safeParse(req.params);

  if (!parsedParams.success) {
    const error = new Error(parsedParams.error.issues[0].message);
    error.statusCode = 400;
    throw error;
  }

  return parsedParams.data.id;
}

async function findUserFolder(folderId, userId) {
  return prisma.topicFolder.findFirst({
    where: {
      id: folderId,
      userId
    },
    include: {
      topics: {
        where: {
          status: {
            not: 'ARCHIVED'
          }
        },
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
      }
    }
  });
}

export async function getFolders(req, res, next) {
  try {
    const folders = await prisma.topicFolder.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        _count: {
          select: {
            topics: true
          }
        }
      }
    });

    return successResponse(res, 'Folders fetched successfully', { folders });
  } catch (error) {
    next(error);
  }
}

export async function createFolder(req, res, next) {
  try {
    const parsedBody = createFolderSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = new Error(parsedBody.error.issues[0].message);
      error.statusCode = 400;
      throw error;
    }

    const folder = await prisma.topicFolder.create({
      data: {
        userId: req.user.id,
        name: parsedBody.data.name,
        description: parsedBody.data.description || '',
        color: parsedBody.data.color || 'blue'
      }
    });

    await createActivityLog(req.user.id, 'FOLDER_CREATED', {
      folderId: folder.id,
      name: folder.name
    });

    return successResponse(res, 'Folder created successfully', { folder }, 201);
  } catch (error) {
    next(error);
  }
}

export async function getFolderById(req, res, next) {
  try {
    const folderId = validateFolderId(req);
    const folder = await findUserFolder(folderId, req.user.id);

    if (!folder) {
      const error = new Error('Folder was not found.');
      error.statusCode = 404;
      throw error;
    }

    return successResponse(res, 'Folder fetched successfully', { folder });
  } catch (error) {
    next(error);
  }
}

export async function updateFolder(req, res, next) {
  try {
    const folderId = validateFolderId(req);

    const existingFolder = await prisma.topicFolder.findFirst({
      where: {
        id: folderId,
        userId: req.user.id
      }
    });

    if (!existingFolder) {
      const error = new Error('Folder was not found.');
      error.statusCode = 404;
      throw error;
    }

    const parsedBody = updateFolderSchema.safeParse(req.body);

    if (!parsedBody.success) {
      const error = new Error(parsedBody.error.issues[0].message);
      error.statusCode = 400;
      throw error;
    }

    const folder = await prisma.topicFolder.update({
      where: {
        id: folderId
      },
      data: parsedBody.data
    });

    await createActivityLog(req.user.id, 'FOLDER_UPDATED', {
      folderId: folder.id,
      name: folder.name
    });

    return successResponse(res, 'Folder updated successfully', { folder });
  } catch (error) {
    next(error);
  }
}

export async function deleteFolder(req, res, next) {
  try {
    const folderId = validateFolderId(req);

    const existingFolder = await prisma.topicFolder.findFirst({
      where: {
        id: folderId,
        userId: req.user.id
      }
    });

    if (!existingFolder) {
      const error = new Error('Folder was not found.');
      error.statusCode = 404;
      throw error;
    }

    await prisma.topicFolder.delete({
      where: {
        id: folderId
      }
    });

    await createActivityLog(req.user.id, 'FOLDER_DELETED', {
      folderId,
      name: existingFolder.name
    });

    return successResponse(res, 'Folder deleted successfully', { folderId });
  } catch (error) {
    next(error);
  }
}