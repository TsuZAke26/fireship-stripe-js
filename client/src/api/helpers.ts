/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CartItem } from 'src/interfaces/ICartItem';
import { InventoryItem } from 'src/interfaces/IInventoryItem';

const API = process.env.SERVER_BASE_URL
  ? process.env.SERVER_BASE_URL
  : 'http://localhost:6200';

export function productCatalogToInventoryItem(productCatalog: any) {
  const {
    id,
    active,
    name,
    description,
    images,
    shippable,
    statement_descriptor,
    unit_label,
    metadata,
    quantity,
    amount,
    currency,
  } = productCatalog;

  const inventoryItem: InventoryItem = {
    id,
    active,
    name,
    description,
    images,
    shippable,
    statement_descriptor,
    unit_label,
    metadata,
    quantity,
    amount,
    currency,
  };

  // console.log('productCatalogToInventoryItem: ', inventoryItem);

  return inventoryItem;
}

export function inventoryItemToCartItem(inventoryItem: InventoryItem) {
  const { id, name, description, images, amount, currency } = inventoryItem;

  const cartItem: CartItem = {
    id,
    name,
    description,
    images,
    amount,
    currency,
    quantity: 1,
  };

  return cartItem;
}

export function convertStripeAmountToPrice(amount: number, currency: string) {
  let currencySymbol: string;
  let currencyAmount: string;

  switch (currency) {
    case 'usd':
      currencySymbol = '$';
      currencyAmount = new Number(amount / 100).toFixed(2);
      break;
    default:
      currencySymbol = '';
      currencyAmount = '-1';
  }

  return currencySymbol + currencyAmount;
}

export async function fetchFromAPI(
  endpointURL: string,
  opts?: Record<string, unknown>
): Promise<any> {
  // console.log('opts: ', opts);
  const { method, body } = { method: 'POST', body: null, ...opts };

  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body != null && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}
