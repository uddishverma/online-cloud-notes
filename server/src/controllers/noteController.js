import { z } from 'zod';

import { asyncHandler } from '../utils/asyncHandler.js';

const noteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
});

const noteUpdateSchema = noteSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field (title or content) is required' }
);

export const createNoteController = (noteService) => {
  const list = asyncHandler(async (req, res) => {
    const notes = noteService.list(req.user.id);
    res.json({ data: notes });
  });

  const getById = asyncHandler(async (req, res) => {
    const note = noteService.findById(Number(req.params.id), req.user.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ data: note });
  });

  const create = asyncHandler(async (req, res) => {
    const payload = noteSchema.parse(req.body);
    const note = noteService.create(req.user.id, payload);
    res.status(201).json({ data: note });
  });

  const update = asyncHandler(async (req, res) => {
    const payload = noteUpdateSchema.parse(req.body);
    const note = noteService.update(Number(req.params.id), req.user.id, payload);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ data: note });
  });

  const remove = asyncHandler(async (req, res) => {
    const deleted = noteService.delete(Number(req.params.id), req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(204).send();
  });

  return {
    list,
    getById,
    create,
    update,
    remove,
  };
};


