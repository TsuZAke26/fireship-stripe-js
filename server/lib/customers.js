"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCustomer = exports.listPaymentMethods = exports.createSetupIntent = void 0;
const supabase_1 = __importDefault(require("./supabase"));
const _1 = require("./");
/**
 * Creates a SetupIntent used to save a credit card for later use
 * @param userId ID of the user in Supabase
 * @returns Stripe.SetupIntent that allows for saving a payment method to a Stripe Customer
 */
async function createSetupIntent(userId) {
    const customer = await getOrCreateCustomer(userId);
    return _1.stripe.setupIntents.create({
        customer: customer.id,
    });
}
exports.createSetupIntent = createSetupIntent;
/**
 * Returns a list of payment methods for a Stripe.Customer user
 * @param userId ID of the user in Supabase
 * @returns List of Stripe payment methods for the given user
 */
async function listPaymentMethods(userId) {
    const customer = await getOrCreateCustomer(userId);
    return _1.stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
    });
}
exports.listPaymentMethods = listPaymentMethods;
/**
 * Gets the exsiting Stripe customer or creates a new record.
 * @param userId ID of the user in Supabase
 * @param params Optional parameters for creating a Customer in Stripe
 * @returns The Stripe.Customer data for a user in Supabase
 */
async function getOrCreateCustomer(userId, params) {
    // Lookup user from 'users' table in Supabase
    const { data, error } = await supabase_1.default.from('users')
        .select('email, stripe_customer_id')
        .eq('id', userId)
        .single();
    // Reject promise if the given user does not exist in Supabase
    if (error) {
        console.error(error.message);
        return Promise.reject();
    }
    console.log(data);
    // Destructure email and stripe_customer_id from returned user
    const userRowData = data[0];
    const { email, stripe_customer_id: stripeCustomerId } = userRowData;
    // If there is no Stripe Customer tied to the application user
    if (!stripeCustomerId) {
        // Create new Stripe Customer
        const customer = await _1.stripe.customers.create(Object.assign({ email, metadata: {
                supabaseUID: userId,
            } }, params));
        // Update 'users' table with new Stripe Customer id
        const { error } = await supabase_1.default.from('users')
            .update({ stripeCustomerId: customer.id })
            .match({ id: userId });
        // Rollback creation of Stripe customer if unable to save id to 'users' in Supabase
        if (error) {
            console.error(error.message);
            await _1.stripe.customers.del(customer.id);
            return Promise.reject();
        }
        return customer;
    }
    // Else, return Stripe Customer using the existing Stripe Customer id
    else {
        return (await _1.stripe.customers.retrieve(stripeCustomerId));
    }
}
exports.getOrCreateCustomer = getOrCreateCustomer;
//# sourceMappingURL=customers.js.map