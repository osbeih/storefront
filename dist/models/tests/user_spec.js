"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../user");
const database_1 = __importDefault(require("../../database"));
const store = new user_1.UserStore();
describe('User Store', () => {
    beforeEach(async () => {
        const conn = await database_1.default.connect();
        await conn.query('TRUNCATE orders, products, users RESTART IDENTITY CASCADE;');
        conn.release();
    });
    it('should create a user', async () => {
        const result = await store.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        expect(result).toEqual({ id: 1, first_name: 'John', last_name: 'Doe' });
    });
    it('should index users', async () => {
        await store.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        const result = await store.index();
        expect(result).toEqual([{ id: 1, first_name: 'John', last_name: 'Doe' }]);
    });
    it('should show a user', async () => {
        await store.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        const result = await store.show("1");
        expect(result).toEqual({ id: 1, first_name: 'John', last_name: 'Doe' });
    });
    it('should delete a user', async () => {
        await store.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        await store.delete("1");
        const result = await store.index();
        expect(result).toEqual([]);
    });
});
