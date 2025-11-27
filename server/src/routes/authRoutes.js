import { Router } from 'express';

export const createAuthRouter = ({ authController, authMiddleware }) => {
  const router = Router();

  router.post('/login', authController.login);
  router.get('/me', authMiddleware, authController.me);

  return router;
};


