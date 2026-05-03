import { json } from "body-parser";
import client from "../database";

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
}

export class ProductStore {

    async create(product: Product): Promise<Product> {

        try {
            const sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *';
            const conn = await client.connect();
            const result = await conn.query(sql, [
                product.name,
                product.price,
                product.category
            ]);
            conn.release();
            const createdProduct = result.rows[0];
            createdProduct.price = parseFloat(createdProduct.price);
            return createdProduct;
        } catch (err) {
            throw new Error(`Unable to create product: ${err}`);
        }
    }

    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows.map(p => ({ ...p, price: parseFloat(p.price) }));
        } catch (err) {
            throw new Error(`Unable to get products: ${err}`);
        }
    }

    async show(id: string): Promise<Product | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM products WHERE id = $1';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0) {
                return null;
            }
            const product = result.rows[0];
            product.price = parseFloat(product.price);
            return product;
        } catch (err) {
            throw new Error(`Unable to get product: ${err}`);
        }
    }

    async delete(id: string): Promise<Product | null> {
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM products WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0) {
                return null;
            }
            const deletedProduct = result.rows[0];
            deletedProduct.price = parseFloat(deletedProduct.price);
            return deletedProduct;
        } catch (err) {
            throw new Error(`Unable to delete product: ${err}`);
        }
    }
}