import { Context } from 'hono';

import { sign } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';

import { createUser } from '../db/queries/insert';
import { getUserByEmail } from '../db/queries/select';

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const user = await getUserByEmail(email);

    if (!user) {
      return c.json({
        message: 'Email or Password is incorrect'
      }, 400);
    }

    const isMatch = Bun.password.verify(password, user.password);

    if (!isMatch) {
      return c.json({
        message: 'Email or Password is incorrect'
      }, 400);
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    const token = await sign(payload, process.env.JWT_SECRET || '');

    return c.json({
      message: 'Successfully Logged in',
      data: {
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
};

export const register = async (c: Context) => {
  try {
    const { username, email, password } = await c.req.json();
    const user = await getUserByEmail(email);

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
};