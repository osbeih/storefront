"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../order");
const user_1 = require("../user");
const product_1 = require("../product");
const database_1 = __importDefault(require("../../database"));
const store = new order_1.OrderStore();
const userStore = new user_1.UserStore();
const productStore = new product_1.ProductStore();
describe('Order Store', () => {
    beforeEach(async () => {
        const conn = await database_1.default.connect();
        await conn.query('TRUNCATE orders, products, users, order_products RESTART IDENTITY CASCADE;');
        conn.release();
    });
    it('should create an order', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        const result = await store.create({
            user_id: user.id,
            status: 'active'
        });
        expect(result).toEqual({
            id: 1,
            user_id: 1,
            status: 'active'
        });
    });
    it('should index orders', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        await store.create({
            user_id: user.id,
            status: 'active'
        });
        const result = await store.index();
        expect(result).toEqual([{
                id: 1,
                user_id: 1,
                status: 'active'
            }]);
    });
    it('should show an order', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        await store.create({
            user_id: user.id,
            status: 'active'
        });
        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            user_id: 1,
            status: 'active'
        });
    });
    it('should delete an order', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        await store.create({
            user_id: user.id,
            status: 'active'
        });
        await store.delete("1");
        const result = await store.index();
        expect(result).toEqual([]);
    });
    it('should add a product to an order', async () => {
        const user = await userStore.create({ first_name: 'John', last_name: 'Doe', password: 'password123' });
        const product = await productStore.create({ name: 'Test', price: 100, category: 'Test' });
        const order = await store.create({
            user_id: user.id,
            status: 'active'
        });
        const result = await store.addProduct(5, order.id.toString(), product.id.toString());
        expect(result).toEqual({
            id: 1,
            quantity: 5,
            order_id: 1,
            product_id: 1
        });
    });
});
