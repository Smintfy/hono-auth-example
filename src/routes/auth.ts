import { z } from 'zod';
import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';

import { login, register } from '../controller/user';

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

export const userValidationSchema = z.object({
  username: z.string()
    .min(4, { message: 'Username must be at least 4 character long' })
    .max(20, { message: 'Username can not exceed 20 characters' }),
  email: z.string()
    .email({ message: 'Invalid email' }),
  password: passwordValidationSchema
});

authRoutes.post('/register', register);
authRoutes.post('/login', login);

export { authRoutes };