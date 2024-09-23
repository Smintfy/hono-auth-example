import { Context } from 'hono';

import { sign } from 'hono/jwt';
import { HTTPException } from 'hono/http-exception';

import { createUser } from '../db/queries/insert';
import { getUserByEmail } from '../db/queries/select';
import { userValidationSchema } from '../routes/auth';

export const login = async (c: Context) => {
  try {
    const { email, password }: { email: string, password: string; } = await c.req.json();
    const user = await getUserByEmail(email.toLowerCase());

    if (!user) {
      return c.json({
        message: 'Email or Password is incorrect'
      }, 400);
    }

    console.log(password, user.password);

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      return c.json({
        message: 'Email or Password is incorrect'
      }, 400);
    }

    const payload = {
      user: {
        id: user.id
      },
      exp: Math.floor(Date.now() / 1000) + 30 // Expires in 30 seconds for testing purposes
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
    const { username, email, password }: { username: string, email: string, password: string; } = await c.req.json();
    const validatedData = userValidationSchema.safeParse({ username, email, password });

    if (!validatedData.success) {
      return c.json({
        errors: validatedData.error.flatten().fieldErrors,
      }, 400);
    }

    const user = await getUserByEmail(email);

    if (user) {
      return c.json({
        message: 'Registration unsuccessful. If you already have an account then try to Log In'
      }, 400);
    }

    const hashedPassword = await Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 4
    });

    const [newUser] = await createUser({ username, email: email.toLowerCase(), password: hashedPassword });
    const userId = newUser.id;

    // payload for auth.
    const payload = {
      user: {
        id: userId
      },
      // exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expires in 1 hour
      exp: Math.floor(Date.now() / 1000) + 30 // Expires in 30 seconds for testing purposes
    };

    const token = await sign(payload, process.env.JWT_SECRET || '');
    return c.json({ token }, 200);
  } catch (e: any) {
    throw new HTTPException(
      e.statusCode, { message: e.message, cause: e }
    );
  }
};