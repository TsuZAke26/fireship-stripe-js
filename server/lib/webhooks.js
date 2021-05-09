"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = void 0;
const _1 = require("./");
/**
 * Business logic for specif Stripe webhooks
 */
const webhookHandlers = {
    'payment_intent.succeeded': async (data) => {
        // business logic
    },
    'payment_intent.payment_failed': async (data) => {
        // business logic
    },
};
/**
 *
 * @param req Validate the stripe webhook secret, then call the handler for the event type
 * @param res Return true to indicate successful webhook handling, else return the error message
 */
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = _1.stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);
    try {
        await webhookHandlers[event.type](event.data.object);
        res.send({ received: true });
    }
    catch (error) {
        res.status(400).send(`WEbhook Error: ${error.message}`);
    }
};
//# sourceMappingURL=webhooks.js.map