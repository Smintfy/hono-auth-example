import { Context, Hono, Next } from 'hono';
import { sign, verify } from 'hono/jwt';
import { config } from 'dotenv';
import { db } from './db';

import { usersTable } from './db/schema';
import { eq } from 'drizzle-orm';

import { HTTPException } from 'hono/http-exception';
import { createUser } from './db/queries/insert';

config({ path: '.env' });

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post('/register', async (c) => {
  const { username, email, password } = await c.req.json();

  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).get();

    if (user) {
      return c.json({
        message: 'User already exists'
      }, 400);
    }

    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 4
    });

    const [newUser] = await createUser({ username, email, password: hashedPassword });
    const userId = newUser.id;

    // payload for auth.
    const payload = {
      user: {
        id: userId
      }
    };

    const token = await sign(payload, process.env.JWT_SECRET || '');

    return c.json({
      message: 'Successfully created account',
      data: {
        username: username,
        email: email,
        token_type: 'Bearer',
        token: token
      }
    }, 200);
  } catch (e: any) {
    throw new HTTPException(
      e.statusCode, { message: e.message, cause: e }
    );
  }
});

const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new HTTPException(401, {
        message: 'Unauthorized access'
      });
    }

    const token = authHeader.split(' ')[1];

    // payload from creating token
    const tokenData = await verify(token, process.env.JWT_SECRET || '');
    c.set('tokenPayload', tokenData);
  } catch (e: any) {
    throw new HTTPException(
      e.statusCode, { message: e.message, cause: e }
    );
  }

  // forward the payload
  await next();
};

app.get('/protected', authMiddleware, (c) => {
  return c.text("You're authorized");
});

export default app;
