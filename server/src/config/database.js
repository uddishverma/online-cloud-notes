import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const DEFAULT_USER = {
  username: 'testuser',
  name: 'Test User',
  password: 'password',
};

export const createDatabase = (sqliteFile) => {
  const absolutePath = path.resolve(process.cwd(), sqliteFile);
  const directory = path.dirname(absolutePath);
  fs.mkdirSync(directory, { recursive: true });

  const db = new Database(absolutePath);
  db.pragma('journal_mode = WAL');

  bootstrapSchema(db);
  seedDefaultUser(db);

  return db;
};

const bootstrapSchema = (db) => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createNotesTable = `
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  db.exec(createUsersTable);
  db.exec(createNotesTable);
};

const seedDefaultUser = (db) => {
  const existingUser = db
    .prepare('SELECT id FROM users WHERE username = ?')
    .get(DEFAULT_USER.username);

  if (existingUser) {
    return;
  }

  const passwordHash = bcrypt.hashSync(DEFAULT_USER.password, 10);
  db.prepare(
    `INSERT INTO users (username, name, password_hash) VALUES (@username, @name, @passwordHash)`
  ).run({
    username: DEFAULT_USER.username,
    name: DEFAULT_USER.name,
    passwordHash,
  });
};


