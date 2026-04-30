import client from "../database";
import bcrypt from 'bcrypt';


export type User = {
    id?: number;
    first_name: string;
    last_name: string;
    password?: string;
}

export class UserStore {

    async create(user: User): Promise<User> {
        const hash = bcrypt.hashSync(user.password + "pepper", parseInt(process.env.SALT_ROUNDS as string));
        try {

            const sql =
                'INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *';

            const conn = await client.connect();

            const result = await conn.query(sql, [
                user.first_name,
                user.last_name,
                hash
            ]);

            conn.release();
            const createdUser = result.rows[0];
            delete createdUser.password;
            return createdUser;
        } catch (err) {
            throw new Error(`Unable to create user: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT * FROM users WHERE first_name = $1 ';
            const result = await conn.query(sql, [username]);


            if (result.rows.length) {
                const user = result.rows[0];
                conn.release();

                if (bcrypt.compareSync(password + "pepper", user.password)) {
                    return user;
                }

            }
            return null
        } catch (err) {
            throw new Error(`Unable to authenticate: ${err}`);
        }
    }

    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT * FROM users';

            const result = await conn.query(sql);

            conn.release();
            const users = result.rows;
            return users.map(u => {
                delete u.password;
                return u;
            });
        } catch (err) {
            throw new Error(`Unable to get users: ${err}`);
        }
    }

    async show(id: string): Promise<User | Response> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT * FROM users WHERE id = $1';

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0]
        } catch (err) {
            throw new Error(`Unable to get user: ${err}`);
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const conn = await client.connect();
            const sql =
                'DELETE FROM users WHERE id = $1 RETURNING *';

            const result = await conn.query(sql, [id]);

            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to delete user: ${err}`);
        }
    }
}