import { Hono } from 'hono';
import { config } from 'dotenv';

import { authMiddleware } from './middleware/auth';
import { authRoutes } from './routes/auth';

config({ path: '.env' });

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/auth', authRoutes);

app.get('/protected', authMiddleware, (c) => {
  return c.text("You're authorized");
});

export default app;