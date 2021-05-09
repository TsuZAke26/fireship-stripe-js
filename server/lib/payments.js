"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const _1 = require("./");
/**
 * Create a Payment Intent with a specific amount
 */
async function createPaymentIntent(amount) {
    // console.log('payments - createPaymentIntent - amount: ', amount);
    // will eventually refer to customers within Stripe as well
    const paymentIntent = await _1.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
    });
    return paymentIntent;
}
exports.createPaymentIntent = createPaymentIntent;
//# sourceMappingURL=payments.js.map