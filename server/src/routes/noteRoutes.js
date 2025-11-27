import { Router } from 'express';

export const createNoteRouter = ({ noteController, authMiddleware }) => {
  const router = Router();

  router.use(authMiddleware);
  router.get('/', noteController.list);
  router.get('/:id', noteController.getById);
  router.post('/', noteController.create);
  router.put('/:id', noteController.update);
  router.delete('/:id', noteController.remove);

  return router;
};


