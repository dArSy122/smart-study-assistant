import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import prisma from '../prisma/client.js';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Authentication token is missing');
      error.statusCode = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        languagePreference: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      const error = new Error('Authenticated user was not found');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    return next();
  } catch (error) {
    error.statusCode = 401;
    error.message = 'Invalid or expired authentication token';
    return next(error);
  }
}