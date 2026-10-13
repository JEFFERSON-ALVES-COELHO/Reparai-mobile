
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

    toObject() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }
}
