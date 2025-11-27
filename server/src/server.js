import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { createDatabase } from './config/database.js';
import { AuthService } from './services/authService.js';
import { NoteService } from './services/noteService.js';
import { TokenService } from './services/tokenService.js';
import { UserService } from './services/userService.js';

const config = loadEnv();
const db = createDatabase(config.sqliteFile);

const userService = new UserService(db);
const tokenService = new TokenService({
  secret: config.jwtSecret,
  expiresIn: config.jwtExpiresIn,
});
const authService = new AuthService(userService, tokenService);
const noteService = new NoteService(db);

const services = {
  userService,
  tokenService,
  authService,
  noteService,
};

const app = createApp({ config, services });

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Cloud Notes API listening on port ${config.port}`);
});


