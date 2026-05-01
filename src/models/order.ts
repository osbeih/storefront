import client from "../database";

export type Order = {
    id?: number;
    user_id: number;
    status: string;
}

export type OrderProduct = {
    id?: number;
    quantity: number;
    order_id: number;
    product_id: number;
}

export class OrderStore {

    async create(order: Order): Promise<Order> {
        try {
            const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
            const conn = await client.connect();
            const result = await conn.query(sql, [
                order.user_id,
                order.status
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to create order: ${err}`);
        }
    }

    async addProduct(quantity: number, orderId: string, productId: string): Promise<OrderProduct> {
        try {
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
            const conn = await client.connect();
            const result = await conn.query(sql, [quantity, orderId, productId]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
        }
    }

    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Unable to get orders: ${err}`);
        }
    }

    async show(id: string): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE id = $1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to get order: ${err}`);
        }
    }

    async delete(id: string): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Unable to delete order: ${err}`);
        }
    }
}