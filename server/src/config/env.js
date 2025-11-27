import dotenv from 'dotenv';

dotenv.config();

export const loadEnv = () => {
  return {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 3001),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || 'replace_me_with_a_real_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
    sqliteFile: process.env.SQLITE_DB || './data/cloud-notes.db',
  };
};


