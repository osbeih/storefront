import express, { Request, Response } from 'express';
import { User, UserStore } from '../user';
import jwt from 'jsonwebtoken';


const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    const users = await store.index();
    res.json(users);
}

const show = async (req: Request, res: Response) => {
    const user = await store.show(req.params.id);
    res.json(user);

}

const create = async (req: Request, res: Response) => {
    const user: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
    }
    try {
        const createdUser = await store.create(user);
        var token = jwt.sign({ user: createdUser }, process.env.TOKEN_SECRET as string);
        res.json(token);
    } catch (err) {
        res.status(400).json(err);
    }

}

const deleteUser = async (req: Request, res: Response) => {
    const user = await store.delete(req.params.id);
    res.json(user);
}

const authenticate = async (req: Request, res: Response) => {
    const user: User = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password
    }
    try {
        const authedUser = await store.authenticate(user.first_name as string, user.password as string);
        if (authedUser) {
            const token = jwt.sign({ user: authedUser }, process.env.TOKEN_SECRET as string);
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

const userRoutes = (app: express.Application) => {
    app.post('/users/authenticate', authenticate);
    app.get('/users', index);
    app.post('/users', create);
    app.get('/users/:id', show);
    app.delete('/users/:id', deleteUser);
}

export default userRoutes;
