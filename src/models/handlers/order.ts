import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../order';
import jwt from 'jsonwebtoken';


const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
    const orders = await store.index();
    res.json(orders);
}

const show = async (req: Request, res: Response) => {
    const order = await store.show(req.params.id);
    res.json(order);
}

const create = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);
    } catch (error) {
        res.status(401).json(error);
        return;
    }

    try {
        const order: Order = {
            user_id: req.body.user_id,
            status: req.body.status || 'active'
        }

        const createdOrder = await store.create(order);
        res.json(createdOrder);
    }
    catch (error) {
        res.status(400).json(error);
    }
}

const deleteOrder = async (req: Request, res: Response) => {
    const order = await store.delete(req.params.id);
    res.json(order);
}

const addProduct = async (req: Request, res: Response) => {
    const orderId: string = req.params.id;
    const productId: string = req.body.productId;
    const quantity: number = parseInt(req.body.quantity);

    try {
        const addedProduct = await store.addProduct(quantity, orderId, productId);
        res.json(addedProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
}

const orderRoutes = (app: express.Application) => {
    app.get('/orders', index);
    app.post('/orders', create);
    app.get('/orders/:id', show);
    app.delete('/orders/:id', deleteOrder);
    app.post('/orders/:id/products', addProduct);
}

export default orderRoutes;