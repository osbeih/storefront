"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../product");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store = new product_1.ProductStore();
const index = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    }
    catch (error) {
        res.status(401).json(error);
        return;
    }
    const products = await store.index();
    res.json(products);
};
const show = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    }
    catch (error) {
        res.status(401).json(error);
        return;
    }
    const product = await store.show(req.params.id);
    res.json(product);
};
const create = async (req, res) => {
    const { name, price, category } = req.body;
    if (!name || !price) {
        return res.status(400).json({
            error: 'name and price are required'
        });
    }
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    }
    catch (error) {
        res.status(401).json(error);
        return;
    }
    const product = await store.create({ name, price, category });
    res.json(product);
};
const deleteProduct = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    }
    catch (error) {
        res.status(401).json(error);
        return;
    }
    const product = await store.delete(req.params.id);
    res.json(product);
};
const productRoutes = (app) => {
    app.get('/products', index);
    app.post('/products', create);
    app.get('/products/:id', show);
    app.delete('/products/:id', deleteProduct);
};
exports.default = productRoutes;
