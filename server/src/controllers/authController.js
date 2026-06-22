import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';
import { successResponse } from '../utils/apiResponse.js';
import { generateToken } from '../utils/generateToken.js';
import { loginSchema, registerSchema } from '../utils/validators.js';
import { createActivityLog } from '../services/activityLogService.js';

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    languagePreference: user.languagePreference,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function register(req, res, next) {
  try {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      const error = new Error('Invalid registration data');
      error.statusCode = 400;
      error.errors = validationResult.error.flatten();
      return next(error);
    }

    const { name, email, password, languagePreference } = validationResult.data;

    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail
      }
    });

    if (existingUser) {
      const error = new Error('User with this email already exists');
      error.statusCode = 409;
      return next(error);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: 'STUDENT',
        languagePreference: languagePreference || 'BG',
        notificationPreference: {
          create: {
            enabled: false,
            preferredTime: '09:00'
          }
        }
      }
    });

    await createActivityLog(user.id, 'USER_REGISTERED', {
      email: user.email,
      role: user.role
    });

    const token = generateToken(user);

    return successResponse(
      res,
      'Registration successful',
      {
        user: formatUser(user),
        token
      },
      201
    );
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const validationResult = loginSchema.safeParse(req.body);

    if (!validationResult.success) {
      const error = new Error('Invalid login data');
      error.statusCode = 400;
      error.errors = validationResult.error.flatten();
      return next(error);
    }

    const { email, password } = validationResult.data;

    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail
      }
    });

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    await createActivityLog(user.id, 'USER_LOGGED_IN', {
      email: user.email,
      role: user.role
    });

    const token = generateToken(user);

    return successResponse(res, 'Login successful', {
      user: formatUser(user),
      token
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentUser(req, res, next) {
  try {
    return successResponse(res, 'Current user loaded successfully', {
      user: req.user
    });
  } catch (error) {
    return next(error);
  }
}