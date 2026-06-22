import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVariables = ['SERVER_PORT', 'CLIENT_URL', 'DATABASE_URL', 'JWT_SECRET'];

for (const variableName of requiredEnvVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  serverPort: Number(process.env.SERVER_PORT),
  clientUrl: process.env.CLIENT_URL,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  openAiApiKey: process.env.OPENAI_API_KEY || ''
};