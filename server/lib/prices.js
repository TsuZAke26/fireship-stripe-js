"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPrices = void 0;
const _1 = require("./");
// import Stripe from "stripe";
async function getAllPrices() {
    const prices = await _1.stripe.prices.list({
        expand: ["data.product"],
    });
    //   console.log(prices.data);
    return prices.data;
}
exports.getAllPrices = getAllPrices;
//# sourceMappingURL=prices.js.map