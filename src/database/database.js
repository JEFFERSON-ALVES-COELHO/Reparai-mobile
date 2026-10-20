
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
            data TEXT NOT NULL
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

export function salvarOcorrencia(ocorrencia) {
  db.runSync(
    `INSERT INTO ocorrencias
            (id, categoria, titulo, descricao, endereco, status, data)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ocorrencia.id,
      ocorrencia.categoria,
      ocorrencia.titulo,
      ocorrencia.descricao,
      ocorrencia.endereco,
      ocorrencia.status ?? 'Enviada',
      ocorrencia.data,
    ]
  );
}

export function listarOcorrencias() {
  return db.getAllSync(
    'SELECT * FROM ocorrencias ORDER BY data DESC'
  );
}

export function atualizarStatus(id, status) {
  const resultado = db.runSync(
    'UPDATE ocorrencias SET status = ? WHERE id = ?',
    [status, id]
  );

  return resultado.changes;
}

// NOVA FUNÇÃO: editar os dados de uma ocorrência.
export function atualizarOcorrencia(ocorrencia) {
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
         WHERE id = ?`,
    [
      ocorrencia.categoria,
      ocorrencia.titulo.trim(),
      ocorrencia.descricao.trim(),
      ocorrencia.endereco.trim(),
      ocorrencia.id,
    ]
  );

  return resultado.changes;
}

// NOVA FUNÇÃO: excluir uma ocorrência pelo ID.
export function excluirOcorrencia(id) {
  if (!id) {
    throw new Error('ID da ocorrência não informado.');
  }

  const resultado = db.runSync(
    'DELETE FROM ocorrencias WHERE id = ?',
    [id]
  );

  return resultado.changes;
}
