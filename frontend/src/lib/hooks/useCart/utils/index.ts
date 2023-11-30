import { Currency } from '@/types/currency';
import { Transaction } from '@/types/transaction';
import { Cart } from '@shared/types/cart/Cart';

export const calculateTransaction = (cart: Cart): Transaction => {
  if (!cart.lineItems) {
    return {
      subtotal: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
      discount: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
      tax: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
      shipping: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
      total: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
    };
  }

  const currencyCode = (cart.sum?.currencyCode ?? 'USD') as Currency;
  const fractionDigits = cart.sum?.fractionDigits ?? 2;

  const totalAmount = cart.sum?.centAmount as number;
  const subTotalAmount = cart.lineItems.reduce(
    (acc, curr) => acc + (curr.price?.centAmount || 0) * (curr.count as number),
    0,
  );

  const discountedAmount = cart.lineItems.reduce(
    (acc, curr) => acc + ((curr.price?.centAmount || 0) * (curr.count as number) - (curr.totalPrice?.centAmount || 0)),
    0,
  );

  const totalTax = totalAmount > 0 ? cart.taxed?.amount.centAmount ?? 0 : 0;

  const totalShipping =
    totalAmount > 0
      ? cart.shippingInfo?.price?.centAmount ?? cart.availableShippingMethods?.[0]?.rates?.[0]?.price?.centAmount ?? 0
      : 0;

  return {
    subtotal: {
      centAmount: subTotalAmount / Math.pow(10, fractionDigits),
      currencyCode,
      fractionDigits,
    },
    discount: {
      centAmount: discountedAmount / Math.pow(10, fractionDigits),
      currencyCode,
      fractionDigits,
    },
    shipping: {
      centAmount: totalShipping / Math.pow(10, fractionDigits),
      currencyCode,
      fractionDigits,
    },
    tax: {
      centAmount: totalTax / Math.pow(10, fractionDigits),
      currencyCode,
      fractionDigits,
    },
    total: {
      centAmount: (totalAmount + totalShipping) / Math.pow(10, fractionDigits),
      currencyCode,
      fractionDigits,
    },
  };
};
