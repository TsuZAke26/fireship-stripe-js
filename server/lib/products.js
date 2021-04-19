"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = void 0;
const _1 = require("./");
// import Stripe from "stripe";
async function getAllProducts() {
    const products = await _1.stripe.products.list();
    // console.log(products.data);
    return products.data;
}
exports.getAllProducts = getAllProducts;
//# sourceMappingURL=products.js.map