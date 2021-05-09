"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeCheckoutSession = void 0;
const _1 = require("./");
/**
 * Creates a Stripe Checkout session with line items
 * @param line_items Actual line items that user wants to purchase
 * @returns the Stripe Checkout session
 */
async function createStripeCheckoutSession(line_items) {
    const url = process.env.CLIENT_BASE_URL;
    // console.log("client base URL: ", url);
    // console.log("line_items: ", line_items);
    const session = await _1.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        success_url: `${url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/checkout/failed`,
    });
    return session;
}
exports.createStripeCheckoutSession = createStripeCheckoutSession;
//# sourceMappingURL=checkout.js.map