import { Context, Next } from 'hono';

import { verify } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new HTTPException(401, {
        message: 'Unauthorized access'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new HTTPException(401, {
        message: 'Unauthorized access'
      });
    }

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