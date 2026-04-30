import { OrderStore } from "../order";
import { UserStore } from "../user";
import { ProductStore } from "../product";
import client from "../../database";

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Store', () => {

    beforeEach(async () => {
        const conn = await client.connect();
        await conn.query('TRUNCATE orders, products, users RESTART IDENTITY CASCADE;');
        conn.release();
    });

    it('should create an order', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        const product = await productStore.create({ name: 'Test', price: 100, category: 'Test' });

        const result = await store.create({
            product_id: product.id!,
            quantity: 1,
            user_id: user.id!,
            status: 'active'
        });

        expect(result).toEqual({
            id: 1,
            product_id: 1,
            quantity: 1,
            user_id: 1,
            status: 'active'
        });
    });

    it('should index orders', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        const product = await productStore.create({ name: 'Test', price: 100, category: 'Test' });

        await store.create({
            product_id: product.id!,
            quantity: 1,
            user_id: user.id!,
            status: 'active'
        });

        const result = await store.index();
        expect(result).toEqual([{
            id: 1,
            product_id: 1,
            quantity: 1,
            user_id: 1,
            status: 'active'
        }]);
    });

    it('should show an order', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        const product = await productStore.create({ name: 'Test', price: 100, category: 'Test' });

        await store.create({
            product_id: product.id!,
            quantity: 1,
            user_id: user.id!,
            status: 'active'
        });

        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            product_id: 1,
            quantity: 1,
            user_id: 1,
            status: 'active'
        });
    });

    it('should delete an order', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        const product = await productStore.create({ name: 'Test', price: 100, category: 'Test' });

        await store.create({
            product_id: product.id!,
            quantity: 1,
            user_id: user.id!,
            status: 'active'
        });

        await store.delete("1");
        const result = await store.index();
        expect(result).toEqual([]);
    });
});