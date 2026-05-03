"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("./server");
const request = (0, supertest_1.default)(server_1.app);
let userId;
let token;
let productid;
let orderId;
describe("Test endpoint responses", () => {
    it("gets the api endpoint", async () => {
        const response = await request.get("/");
        expect(response.status).toBe(200);
    });
    describe('User routes', () => {
        it("creates a user", async () => {
            const response = await request.post("/users").send({ first_name: 'John', last_name: 'Doe', password: 'password123' });
            userId = response.body.id;
            token = response.body.token;
            expect(response.status).toBe(200);
        });
        it("gets the user endpoint", async () => {
            const response = await request.get("/users").set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("gets a single user", async () => {
            const response = await request.get(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
    });
    describe('Product routes', () => {
        it("creates a product", async () => {
            const response = await request.post("/products").set('Authorization', `Bearer ${token}`).send({ name: 'Product1', price: 100, category: 'Category1' });
            productid = response.body.id;
            expect(response.status).toBe(200);
        });
        it("gets the products endpoint", async () => {
            const response = await request.get("/products").set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("gets a single product", async () => {
            const response = await request
                .get(`/products/${productid}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
    });
    describe('Order routes', () => {
        it("creates an order", async () => {
            const response = await request
                .post("/orders")
                .set('Authorization', `Bearer ${token}`)
                .send({ user_id: userId, status: 'active' });
            orderId = response.body.id;
            expect(response.status).toBe(200);
        });
        it("gets the order endpoint", async () => {
            const response = await request.get("/orders").set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("gets a single order", async () => {
            const response = await request.get(`/orders/${orderId}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("deletes an order", async () => {
            const response = await request.delete(`/orders/${orderId}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
    });
    describe('Cleanup', () => {
        it("deletes a product", async () => {
            const response = await request
                .delete(`/products/${productid}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("deletes a user", async () => {
            const response = await request.delete(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
    });
});
