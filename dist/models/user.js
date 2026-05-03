"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserStore {
    async create(user) {
        const hash = bcrypt_1.default.hashSync(user.password + "pepper", parseInt(process.env.SALT_ROUNDS));
        try {
            const sql = 'INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [
                user.first_name,
                user.last_name,
                hash
            ]);
            conn.release();
            const createdUser = result.rows[0];
            delete createdUser.password;
            return createdUser;
        }
        catch (err) {
            throw new Error(`Unable to create user: ${err}`);
        }
    }
    async authenticate(username, password) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE first_name = $1 ';
            const result = await conn.query(sql, [username]);
            if (result.rows.length) {
                const user = result.rows[0];
                conn.release();
                if (bcrypt_1.default.compareSync(password + "pepper", user.password)) {
                    return user;
                }
            }
            return null;
        }
        catch (err) {
            throw new Error(`Unable to authenticate: ${err}`);
        }
    }
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            const users = result.rows;
            return users.map(u => {
                delete u.password;
                return u;
            });
        }
        catch (err) {
            throw new Error(`Unable to get users: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE id = $1';
            const result = await conn.query(sql, [id]);
            const user = result.rows[0];
            conn.release();
            if (user) {
                delete user.password;
            }
            return user;
        }
        catch (err) {
            throw new Error(`Unable to get user: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM users WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [id]);
            const user = result.rows[0];
            conn.release();
            if (user) {
                delete user.password;
            }
            return user;
        }
        catch (err) {
            throw new Error(`Unable to delete user: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
