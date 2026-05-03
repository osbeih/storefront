"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./models/handlers/user"));
const product_1 = __importDefault(require("./models/handlers/product"));
const order_1 = __importDefault(require("./models/handlers/order"));
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};
exports.app = (0, express_1.default)();
const address = "127.0.0.1:3000";
exports.app.use(body_parser_1.default.json());
exports.app.use((0, cors_1.default)(corsOptions));
exports.app.get('/', function (req, res) {
    res.send('Hello World!');
});
(0, user_1.default)(exports.app);
(0, product_1.default)(exports.app);
(0, order_1.default)(exports.app);
exports.app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
