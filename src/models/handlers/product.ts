import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../product';
import jwt from 'jsonwebtoken';

const store = new ProductStore();



const index = async (req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.json(products);
    }
    catch (error) {
        res.status(500).json(error);
    }

}
const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}

const create = async (req: Request, res: Response) => {
    const { name, price, category } = req.body;

    if (!name || !price) {
        return res.status(400).json({
            error: 'name and price are required'
        });
    }
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);
    } catch (error) {
        res.status(401).json(error);
        return;
    }

    const product = await store.create({ name, price, category });
    res.json(product);
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);
    } catch (error) {
        res.status(401).json(error);
        return;
    }
    const product = await store.delete(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
}

const productRoutes = (app: express.Application) => {
    app.get('/products', index);
    app.post('/products', create);
    app.get('/products/:id', show);
    app.delete('/products/:id', deleteProduct);
}

export default productRoutes;