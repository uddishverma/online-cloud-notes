import { z } from 'zod';

import { asyncHandler } from '../utils/asyncHandler.js';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const createAuthController = (authService) => {
  const login = asyncHandler(async (req, res) => {
    const { username, password } = loginSchema.parse(req.body);
    const result = await authService.login(username, password);
    res.json({ data: result });
  });

  const me = asyncHandler(async (req, res) => {
    const profile = authService.getProfile(req.user.id);
    res.json({ data: profile });
  });

  return {
    login,
    me,
  };
};


