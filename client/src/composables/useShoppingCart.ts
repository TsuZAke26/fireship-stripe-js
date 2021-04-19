import { computed, reactive } from 'vue';

import { CartItem } from 'src/interfaces/ICartItem';
import { convertStripeAmountToPrice } from 'src/api/helpers';

// Cart-specific
const cart: Array<CartItem> = reactive([]);

const containsCartItem = (cartItem: CartItem) => {
  return cart.find((cart) => cart.id === cartItem.id);
};

const getItemPrice = (cartItem: CartItem) => {
  return cartItem.amount * cartItem.quantity;
};

const useShoppingCart = () => {
  const cartSize = computed(() => cart.length);

  const cartSubtotal = computed(() => {
    const subtotal = cart.reduce(function (accumulator, currentValue) {
      return accumulator + getItemPrice(currentValue);
    }, 0);

    return convertStripeAmountToPrice(subtotal, 'usd');
  });

  const addCartItem = (cartItem: CartItem) => {
    if (!containsCartItem(cartItem)) {
      cart.push(cartItem);
    } else {
      changeItemQuantity(cartItem, 1);
    }
  };

  const changeItemQuantity = (cartItem: CartItem, value: number) => {
    if (containsCartItem(cartItem)) {
      const itemIndex = cart.findIndex((cart) => cart.id === cartItem.id);

      if (cart[itemIndex].quantity + value >= 1) {
        cart[itemIndex].quantity += value;
      } else {
        removeCartItem(cartItem.id);
      }
    }
  };

  const removeCartItem = (itemId: number) => {
    const itemIndex = cart.findIndex((cart) => cart.id === itemId);
    const removedItem = cart.splice(itemIndex, 1);
    console.log(removedItem);
  };

  const clearCart = () => {
    cart.splice(0);
  };

  const convertCartItemToStripeLineItem = (cartItem: CartItem) => {
    const { name, description, images, amount, currency, quantity } = cartItem;

    const result: Record<string, unknown> = {
      name,
      images,
      amount,
      currency,
      quantity,
    };

    if (description) {
      result.description = description;
    }

    return result;
  };

  return {
    cartItems: cart,
    cartSubtotal,
    cartSize,
    addCartItem,
    changeItemQuantity,
    removeCartItem,
    clearCart,
    convertCartItemToStripeLineItem,
  };
};

export default useShoppingCart;
