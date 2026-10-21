
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

        CREATE TABLE IF NOT EXISTS ocorrencias (
            id TEXT PRIMARY KEY NOT NULL,
            categoria TEXT NOT NULL,
            titulo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            endereco TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Enviada',
            data TEXT NOT NULL,
            user_id INTEGER
        );
    `);

  // Migração segura: adiciona user_id aos bancos já existentes.
  const colunas = db.getAllSync('PRAGMA table_info(ocorrencias)');
  const possuiUsuario = colunas.some(
    (coluna) => coluna.name === 'user_id'
  );

  if (!possuiUsuario) {
    db.execSync('ALTER TABLE ocorrencias ADD COLUMN user_id INTEGER');
  }

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

function validarUsuarioId(usuarioId) {
  if (
    usuarioId === undefined ||
    usuarioId === null ||
    !Number.isInteger(Number(usuarioId)) ||
    Number(usuarioId) <= 0
  ) {
    throw new Error('Usuário não identificado. Faça login novamente.');
  }

  return Number(usuarioId);
}

export function salvarOcorrencia(ocorrencia) {
  const usuarioId = validarUsuarioId(ocorrencia?.user_id);

  db.runSync(
    `INSERT INTO ocorrencias
            (id, categoria, titulo, descricao, endereco, status, data, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ocorrencia.id,
      ocorrencia.categoria,
      ocorrencia.titulo,
      ocorrencia.descricao,
      ocorrencia.endereco,
      ocorrencia.status ?? 'Enviada',
      ocorrencia.data,
      usuarioId,
    ]
  );
}

export function listarOcorrencias(usuarioId) {
  const id = validarUsuarioId(usuarioId);

  return db.getAllSync(
    `SELECT * FROM ocorrencias
         WHERE user_id = ?
         ORDER BY data DESC`,
    [id]
  );
}

export function atualizarStatus(id, status, usuarioId) {
  const userId = validarUsuarioId(usuarioId);

  const resultado = db.runSync(
    `UPDATE ocorrencias
         SET status = ?
         WHERE id = ? AND user_id = ?`,
    [status, id, userId]
  );

  return resultado.changes;
}

export function atualizarOcorrencia(ocorrencia, usuarioId) {
  const userId = validarUsuarioId(usuarioId);

  if (
    !ocorrencia?.id ||
    !ocorrencia.categoria ||
    !ocorrencia.titulo?.trim() ||
    !ocorrencia.descricao?.trim() ||
    !ocorrencia.endereco?.trim()
  ) {
    throw new Error(
      'Informe o ID, a categoria, o título, a descrição e o endereço.'
    );
  }

  const resultado = db.runSync(
    `UPDATE ocorrencias
         SET categoria = ?,
             titulo = ?,
             descricao = ?,
             endereco = ?
         WHERE id = ? AND user_id = ?`,
    [
      ocorrencia.categoria,
      ocorrencia.titulo.trim(),
      ocorrencia.descricao.trim(),
      ocorrencia.endereco.trim(),
      ocorrencia.id,
      userId,
    ]
  );

  return resultado.changes;
}

export function excluirOcorrencia(id, usuarioId) {
  const userId = validarUsuarioId(usuarioId);

  if (!id) {
    throw new Error('ID da ocorrência não informado.');
  }

  const resultado = db.runSync(
    'DELETE FROM ocorrencias WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  return resultado.changes;
}
