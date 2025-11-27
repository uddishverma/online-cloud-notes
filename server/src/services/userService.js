export class UserService {
  constructor(db) {
    this.db = db;
    this.findByUsernameStmt = this.db.prepare(
      `SELECT id, username, name, password_hash AS passwordHash FROM users WHERE username = ?`
    );
    this.findByIdStmt = this.db.prepare(
      `SELECT id, username, name FROM users WHERE id = ?`
    );
  }

  findByUsername(username) {
    if (!username) return null;
    return this.findByUsernameStmt.get(username);
  }

  findById(id) {
    if (!id) return null;
    return this.findByIdStmt.get(id);
  }
}


