import { UserStore } from "../user";
import client from "../../database";

const store = new UserStore();

describe('User Store', () => {

    beforeEach(async () => {
        const conn = await client.connect();
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