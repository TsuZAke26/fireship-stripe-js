import { stripe } from "./";
// import Stripe from "stripe";

export async function getAllPrices() {
  const prices = await stripe.prices.list({
    expand: ["data.product"],
  });
  //   console.log(prices.data);

  return prices.data;
}
