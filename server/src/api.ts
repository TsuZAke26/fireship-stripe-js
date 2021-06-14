const expressRequestId = require('express-request-id')({ setHeader: false });
const morgan = require('morgan');

const jwt = require('jsonwebtoken');
import supabase from './supabase';

import express, { Request, Response, NextFunction } from 'express';
export const app = express();

/**
 * Express middleware setup
 */
// Add ID to each incoming request
app.use(expressRequestId);

// Log incoming HTTP requests
morgan.token('id', (req: any) => req.id.split('-')[0]);
app.use(
  morgan('[:date[iso] #:id] Started :method :url for :remote-addr', {
    immediate: true,
  })
);
app.use(
  morgan(
    '[:date[iso] #:id] Completed :status with content length :res[content-length] in :response-time ms'
  )
);

// Allow Express to stringify JSON to be interpreted correctly
app.use(express.json());

// Allow other origins to call Express endpoints
import cors from 'cors';
app.use(cors({ origin: true }));

// Sets rawBody request header for webhook testing
app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);

// Decodes Supabase user JWT and adds user to request data
app.use(decodeJWT);

// Decodes JSON Web Token sent with API request.
async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    // Pull out the JWT sent for the Authorization header
    const authToken = req.headers.authorization.split('Bearer ')[1];

    try {
      // Verify token is for an authenticated user
      const decodedToken = await verifyAuthToken(authToken);

      // Add successfully decoded user data (i.e. user session is valid) to request data
      req['currentUser'] = decodedToken;
    } catch (error) {
      console.error(error);

      // Return unauthenticated HTTP response code if user is not authenticated
      res.status(401).send({ status: 'FAILED', message: error.message });
    }
  }

  next();
}

async function verifyAuthToken(token: string) {
  const decodedJWT = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

  const { aud: auth, sub: id } = decodedJWT;

  // Look up user ID in Supabase
  const { data, error } = await supabase
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

function validateUser(req: Request) {
  const user = req['currentUser'];
  if (!user) {
    throw new Error(
      'You must be logged in to make this request. i.e. Authorization: Bearer <token>'
    );
  }

  return user;
}

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
  '/create-checkout-session',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
);

// Allow Stripe payment intents to be created
import { createPaymentIntent } from './payments';
app.post(
  '/payments',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(await createPaymentIntent(body.amount));
  })
);

// Testing JWT validation
app.post('/jwt', (req: Request, res: Response) => {
  res.status(200).send({ status: 'Success', currentUser: req['currentUser'] });
});

import { createSetupIntent, listPaymentMethods } from './customers';
// Retrieve a list of all payment cards for the user
app.get(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const wallet = await listPaymentMethods(user.sub);
    res.send(wallet.data);
  })
);

// Create Stripe SetupIntent to allow user to save a new payment method
app.post(
  '/wallet',
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const setupIntent = await createSetupIntent(user.sub);

    res.send(setupIntent);
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
