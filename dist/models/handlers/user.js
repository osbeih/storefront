"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store = new user_1.UserStore();
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
    const users = await store.index();
    res.json(users);
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
    const user = await store.show(req.params.id);
    res.json(user);
};
const create = async (req, res) => {
    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
    };
    try {
        const createdUser = await store.create(user);
        var token = jsonwebtoken_1.default.sign({ user: createdUser }, process.env.TOKEN_SECRET);
        res.json({ "id": createdUser.id, "first_name": createdUser.first_name, "last_name": createdUser.last_name, "token": token });
    }
    catch (err) {
        res.status(400).json({ "message": `user creation failed ${err}` });
    }
};
const deleteUser = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader?.split(' ')[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
    }
    catch (error) {
        res.status(401).json(error);
        return;
    }
    const user = await store.delete(req.params.id);
    res.json(user);
};
const authenticate = async (req, res) => {
    try {
        const user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password
        };
        try {
            const authedUser = await store.authenticate(user.first_name, user.password);
            if (authedUser) {
                const token = jsonwebtoken_1.default.sign({ user: authedUser }, process.env.TOKEN_SECRET);
                res.json(token);
            }
            else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        }
        catch (err) {
            res.status(400).json(err);
        }
    }
    catch (error) {
        res.status(401).json(error);
        return;
    }
};
const userRoutes = (app) => {
    app.post('/users/authenticate', authenticate);
    app.get('/users', index);
    app.post('/users', create);
    app.get('/users/:id', show);
    app.delete('/users/:id', deleteUser);
};
exports.default = userRoutes;
