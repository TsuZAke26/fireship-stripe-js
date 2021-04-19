"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
// Allow Express to stringify JSON to be interpreted correctly
exports.app.use(express_1.default.json());
// Allow other origins to call Express endpoints
const cors_1 = __importDefault(require("cors"));
exports.app.use(cors_1.default({ origin: true }));
// Test endpoint
exports.app.post("/test", (req, res) => {
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 1.07 });
});
// Retrieve all Stripe Prices
const prices_1 = require("./prices");
exports.app.get("/prices-with-product", runAsync(async (req, res) => {
    res.send(await prices_1.getAllPrices());
}));
// Retrieve all Stripe Products
const products_1 = require("./products");
exports.app.get("/products", runAsync(async (req, res) => {
    res.send(await products_1.getAllProducts());
}));
// Allow Stripe checkout sessions to be created
const checkout_1 = require("./checkout");
exports.app.post("/create-checkout-session/", runAsync(async ({ body }, res) => {
    res.send(await checkout_1.createStripeCheckoutSession(body.line_items));
}));
/**
 * Catch async errors when awaiting promises for asynchronous functions.
 * @param callback - async function
 * @returns Resolved async function passed in, or caught error if encountered
 */
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
//# sourceMappingURL=api.js.map