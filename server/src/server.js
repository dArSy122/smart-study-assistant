import app from './app.js';
import { env } from './config/env.js';

app.listen(env.serverPort, () => {
  console.log(`Smart Study Assistant API is running on port ${env.serverPort}`);
});