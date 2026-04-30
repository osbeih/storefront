import { ProductStore } from "../product";
import client from "../../database";

const store = new ProductStore();

describe('Product Store', () => {

    beforeEach(async () => {
        const conn = await client.connect();
        await conn.query('TRUNCATE orders, products, users RESTART IDENTITY CASCADE;');
        conn.release();
    });

    it('should create a product', async () => {
        const result = await store.create({ name: 'Test Product', price: 100, category: 'Test' });
        expect(result).toEqual({ id: 1, name: 'Test Product', price: 100, category: 'Test' });
    });

    it('should index products', async () => {
        await store.create({ name: 'Test Product', price: 100, category: 'Test' });
        const result = await store.index();
        expect(result).toEqual([{ id: 1, name: 'Test Product', price: 100, category: 'Test' }]);
    });

    it('should show a product', async () => {
        await store.create({ name: 'Test Product', price: 100, category: 'Test' });
        const result = await store.show("1");
        expect(result).toEqual({ id: 1, name: 'Test Product', price: 100, category: 'Test' });
    });

    it('should delete a product', async () => {
        await store.create({ name: 'Test Product', price: 100, category: 'Test' });
        await store.delete("1");
        const result = await store.index();
        expect(result).toEqual([]);
    });
});