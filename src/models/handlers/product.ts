import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../product';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    const products = await store.index();
    res.json(products);
}

const show = async (req: Request, res: Response) => {
    const product = await store.show(req.params.id);
    res.json(product);
}

const create = async (req: Request, res: Response) => {
    const { name, price, category } = req.body;

    if (!name || !price) {
        return res.status(400).json({
            error: 'name and price are required'
        });
    }

    const product = await store.create({ name, price, category });
    res.json(product);
};

const productRoutes = (app: express.Application) => {
    app.get('/products', index);
    app.post('/products', create);
    app.get('/products/:id', show);
}

export default productRoutes;