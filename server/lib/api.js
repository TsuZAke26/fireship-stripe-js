"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const expressRequestId = require('express-request-id')({ setHeader: false });
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const supabase_1 = __importDefault(require("./supabase"));
const express_1 = __importDefault(require("express"));
exports.app = express_1.default();
/**
 * Express middleware setup
 */
// Add ID to each incoming request
exports.app.use(expressRequestId);
// Log incoming HTTP requests
morgan.token('id', (req) => req.id.split('-')[0]);
exports.app.use(morgan('[:date[iso] #:id] Started :method :url for :remote-addr', {
    immediate: true,
}));
exports.app.use(morgan('[:date[iso] #:id] Completed :status with content length :res[content-length] in :response-time ms'));
// Allow Express to stringify JSON to be interpreted correctly
exports.app.use(express_1.default.json());
// Allow other origins to call Express endpoints
const cors_1 = __importDefault(require("cors"));
exports.app.use(cors_1.default({ origin: true }));
// Sets rawBody request header for webhook testing
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
}));
// Decodes Supabase user JWT and adds user to request data
exports.app.use(decodeJWT);
// Decodes JSON Web Token sent with API request.
async function decodeJWT(req, res, next) {
    var _a, _b;
    if ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer ')) {
        // Pull out the JWT sent for the Authorization header
        const authToken = req.headers.authorization.split('Bearer ')[1];
        try {
            // Verify token is for an authenticated user
            const decodedToken = await verifyAuthToken(authToken);
            // Add successfully decoded user data (i.e. user session is valid) to request data
            req['currentUser'] = decodedToken;
        }
        catch (error) {
            console.error(error);
            // Return unauthenticated HTTP response code if user is not authenticated
            res.status(401).send({ status: 'FAILED', message: error.message });
        }
    }
    next();
}
async function verifyAuthToken(token) {
    const decodedJWT = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    const { aud: auth, sub: id } = decodedJWT;
    // Look up user ID in Supabase
    const { data, error } = await supabase_1.default
        .from('users')
        .select('id')
        .eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
    // Verify that "sub" is a user that exists (has a record in "users" table)
    if (data.length === 0) {
        throw new Error('User does not exist');
    }
    // Verify that "aud" from JWT is "authenticated" (user is authenticated)
    else if (auth !== 'authenticated') {
        throw new Error('User is not authenticated');
    }
    return decodedJWT;
}
function validateUser(req) {
    const user = req['currentUser'];
    if (!user) {
        throw new Error('You must be logged in to make this request. i.e. Authorization: Bearer <token>');
    }
    return user;
}
/**
 * API Endpoints
 */
// Test endpoint
exports.app.post('/test', (req, res) => {
    const amount = req.body.amount;
    res.status(200).send({ with_tax: amount * 1.07 });
});
// Retrieve all Stripe Prices
const prices_1 = require("./prices");
exports.app.get('/prices-with-product', runAsync(async (req, res) => {
    res.send(await prices_1.getAllPrices());
}));
// Retrieve all Stripe Products
const products_1 = require("./products");
exports.app.get('/products', runAsync(async (req, res) => {
    res.send(await products_1.getAllProducts());
}));
// Allow Stripe checkout sessions to be created
const checkout_1 = require("./checkout");
exports.app.post('/create-checkout-session', runAsync(async ({ body }, res) => {
    res.send(await checkout_1.createStripeCheckoutSession(body.line_items));
}));
// Allow Stripe payment intents to be created
const payments_1 = require("./payments");
exports.app.post('/payments', runAsync(async ({ body }, res) => {
    res.send(await payments_1.createPaymentIntent(body.amount));
}));
// Testing JWT validation
exports.app.post('/jwt', (req, res) => {
    res.status(200).send({ status: 'Success', currentUser: req['currentUser'] });
});
const customers_1 = require("./customers");
// Retrieve a list of all payment cards for the user
exports.app.get('/wallet', runAsync(async (req, res) => {
    const user = validateUser(req);
    const wallet = await customers_1.listPaymentMethods(user.sub);
    res.send(wallet.data);
}));
// Create Stripe SetupIntent to allow user to save a new payment method
exports.app.post('/wallet', runAsync(async (req, res) => {
    const user = validateUser(req);
    const setupIntent = await customers_1.createSetupIntent(user.sub);
    res.send(setupIntent);
}));
/**
 * Webhooks
 */
// Handle Stripe webhooks
const webhooks_1 = require("./webhooks");
exports.app.post('/hooks', runAsync(webhooks_1.handleStripeWebhook));
/**
 * Utility functions
 */
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