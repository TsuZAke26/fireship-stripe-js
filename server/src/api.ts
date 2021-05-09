import express, { Request, Response, NextFunction } from 'express';
export const app = express();

/**
 * Express middleware setup
 */
// Allow Express to stringify JSON to be interpreted correctly
app.use(express.json());

// Allow other origins to call Express endpoints
import cors from 'cors';
app.use(cors({ origin: true }));

// Sets rawBody for webhook testing
app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

/**
 * API Endpoints
 */
// Test endpoint
app.post('/test', (req: Request, res: Response) => {
  const amount = req.body.amount;

  res.status(200).send({ with_tax: amount * 1.07 });
});

// Retrieve all Stripe Prices
import { getAllPrices } from './prices';
app.get(
  '/prices-with-product',
  runAsync(async (req: Request, res: Response) => {
    res.send(await getAllPrices());
  })
);

// Retrieve all Stripe Products
import { getAllProducts } from './products';
app.get(
  '/products',
  runAsync(async (req: Request, res: Response) => {
    res.send(await getAllProducts());
  })
);

// Allow Stripe checkout sessions to be created
import { createStripeCheckoutSession } from './checkout';
app.post(
  '/create-checkout-session/',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);

// Allow Stripe payment intents to be created
import { createPaymentIntent } from './payments';
app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    // console.log('payments - body: ', body);
    res.send(await createPaymentIntent(body.amount));
  })
);

/**
 * Webhooks
 */
// Handle Stripe webhooks
import { handleStripeWebhook } from './webhooks';
app.post('/hooks', runAsync(handleStripeWebhook));

/**
 * Utility functions
 */
/**
 * Catch async errors when awaiting promises for asynchronous functions.
 * @param callback - async function
 * @returns Resolved async function passed in, or caught error if encountered
 */
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}
