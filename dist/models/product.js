"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    async create(product) {
        try {
            const sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [
                product.name,
                product.price,
                product.category
            ]);
            conn.release();
            const createdProduct = result.rows[0];
            createdProduct.price = parseFloat(createdProduct.price);
            return createdProduct;
        }
        catch (err) {
            throw new Error(`Unable to create product: ${err}`);
        }
    }
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            const products = result.rows;
            return products.map(p => ({ ...p, price: parseFloat(p.price) }));
        }
        catch (err) {
            throw new Error(`Unable to get products: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products WHERE id = $1';
            const result = await conn.query(sql, [id]);
            conn.release();
            const product = result.rows[0];
            product.price = parseFloat(product.price);
            return product;
        }
        catch (err) {
            throw new Error(`Unable to get product: ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM products WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            const deletedProduct = result.rows[0];
            deletedProduct.price = parseFloat(deletedProduct.price);
            return deletedProduct;
        }
        catch (err) {
            throw new Error(`Unable to delete product: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
