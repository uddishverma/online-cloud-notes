import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { createAuthController } from './controllers/authController.js';
import { createNoteController } from './controllers/noteController.js';
import { createAuthMiddleware } from './middlewares/authMiddleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { createAuthRouter } from './routes/authRoutes.js';
import { createHealthRouter } from './routes/healthRoutes.js';
import { createNoteRouter } from './routes/noteRoutes.js';

export const createApp = ({ config, services }) => {
  const app = express();

  const corsOptions =
    config.corsOrigin === '*'
      ? { origin: true, credentials: true }
      : {
          origin: config.corsOrigin.split(',').map((origin) => origin.trim()),
          credentials: true,
        };

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

  const authMiddleware = createAuthMiddleware(services.tokenService);
  const authController = createAuthController(services.authService);
  const noteController = createNoteController(services.noteService);

  app.use('/api/health', createHealthRouter());
  app.use(
    '/api/auth',
    createAuthRouter({
      authController,
      authMiddleware,
    })
  );
  app.use(
    '/api/notes',
    createNoteRouter({
      noteController,
      authMiddleware,
    })
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};


