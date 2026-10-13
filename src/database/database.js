import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('reparai.db');

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  const existing = db.getFirstSync(
    'SELECT id FROM users WHERE email = ?',
    ['aluno@senac.com']
  );

  if (!existing) {
    db.runSync(
      `INSERT INTO users (name, email, password)
       VALUES (?, ?, ?)`,
      ['Aluno Teste', 'aluno@senac.com', '1234']
    );
  }
}
