
import { db } from '../database/database';

export class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    static authenticateLocal(email, password) {
        const emailNormalizado = email.trim().toLowerCase();

        const user = db.getFirstSync(
            `SELECT id, name, email
             FROM users
             WHERE LOWER(email) = ? AND password = ?`,
            [emailNormalizado, password]
        );

        if (!user) {
            throw new Error('E-mail ou senha incorretos.');
        }

        return new User(user.id, user.name, user.email);
    }

    static registerLocal(name, email, password) {
        const nomeNormalizado = name.trim();
        const emailNormalizado = email.trim().toLowerCase();

        if (!nomeNormalizado || !emailNormalizado || !password) {
            throw new Error('Preencha todos os campos.');
        }

        const existente = db.getFirstSync(
            'SELECT id FROM users WHERE LOWER(email) = ?',
            [emailNormalizado]
        );

        if (existente) {
            throw new Error('Este e-mail já está cadastrado.');
        }

        try {
            const resultado = db.runSync(
                `INSERT INTO users (name, email, password)
                 VALUES (?, ?, ?)`,
                [nomeNormalizado, emailNormalizado, password]
            );

            return new User(
                resultado.lastInsertRowId,
                nomeNormalizado,
                emailNormalizado
            );
        } catch (error) {
            if (String(error.message).toLowerCase().includes('unique')) {
                throw new Error('Este e-mail já está cadastrado.');
            }

            throw new Error('Não foi possível criar a conta. Tente novamente.');
        }
    }

    toObject() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }
}
