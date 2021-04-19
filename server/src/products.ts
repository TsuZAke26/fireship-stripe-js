import { stripe } from "./";
// import Stripe from "stripe";

export async function getAllProducts() {
  const products = await stripe.products.list();
  // console.log(products.data);

  return products.data;
}
