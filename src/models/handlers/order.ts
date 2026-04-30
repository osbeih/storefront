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
            product_id: req.body.product_id,
            quantity: req.body.quantity,
            user_id: req.body.user_id,
            status: ''
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

const orderRoutes = (app: express.Application) => {
    app.get('/orders', index);
    app.post('/orders', create);
    app.get('/orders/:id', show);
    app.delete('/orders/:id', deleteOrder);
}

export default orderRoutes;