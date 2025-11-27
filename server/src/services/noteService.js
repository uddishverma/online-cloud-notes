const serializeNote = (dbRecord) => {
  if (!dbRecord) return null;
  return {
    id: dbRecord.id,
    userId: dbRecord.user_id,
    title: dbRecord.title,
    content: dbRecord.content,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  };
};

export class NoteService {
  constructor(db) {
    this.db = db;
    this.listStmt = this.db.prepare(
      `SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC`
    );
    this.findStmt = this.db.prepare(
      `SELECT * FROM notes WHERE id = ? AND user_id = ?`
    );
    this.createStmt = this.db.prepare(
      `INSERT INTO notes (user_id, title, content, created_at, updated_at)
       VALUES (@userId, @title, @content, @createdAt, @updatedAt)`
    );
    this.updateStmt = this.db.prepare(
      `UPDATE notes
       SET title = COALESCE(@title, title),
           content = COALESCE(@content, content),
           updated_at = @updatedAt
       WHERE id = @id AND user_id = @userId`
    );
    this.deleteStmt = this.db.prepare(
      `DELETE FROM notes WHERE id = ? AND user_id = ?`
    );
  }

  list(userId) {
    return this.listStmt.all(userId).map(serializeNote);
  }

  findById(id, userId) {
    return serializeNote(this.findStmt.get(id, userId));
  }

  create(userId, payload) {
    const now = new Date().toISOString();
    const info = this.createStmt.run({
      userId,
      title: payload.title,
      content: payload.content,
      createdAt: now,
      updatedAt: now,
    });
    return this.findById(info.lastInsertRowid, userId);
  }

  update(id, userId, payload) {
    const now = new Date().toISOString();
    const updateResult = this.updateStmt.run({
      id,
      userId,
      title: payload.title ?? null,
      content: payload.content ?? null,
      updatedAt: now,
    });

    if (updateResult.changes === 0) {
      return null;
    }

    return this.findById(id, userId);
  }

  delete(id, userId) {
    const result = this.deleteStmt.run(id, userId);
    return result.changes > 0;
  }
}


