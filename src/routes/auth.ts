import { z } from 'zod';
import { Hono } from 'hono';

import { signIn, signUp, signOut } from '../controller/user';

const authRoutes = new Hono();

const passwordValidationSchema = z.string()
  .min(8, { message: 'At least 8 characters long' })
  .max(20, { message: 'Password can not exceed 20 characters' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'At least one uppercase',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'At least one lowercase',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'At least one number'
  })
  .refine((password) => /[#?!@$%^&*-]/.test(password), {
    message: 'At least one special character',
  });

const usernameValidationSchema = z.string()
  .min(4, { message: 'Username must be at least 4 character long' })
  .max(20, { message: 'Username can not exceed 20 characters' })
  .refine((username) => /^[a-zA-Z0-9_]+$/.test(username), {
    message: 'Username can only contain letters, numbers, and underscores.'
  });

export const userValidationSchema = z.object({
  username: usernameValidationSchema,
  email: z.string()
    .email({ message: 'Invalid email' }),
  password: passwordValidationSchema
});

authRoutes.post('/signup', signUp);
authRoutes.post('/signin', signIn);
authRoutes.post('/signout', signOut);

export { authRoutes };