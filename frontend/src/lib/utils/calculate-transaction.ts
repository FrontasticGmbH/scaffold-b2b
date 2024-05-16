import { Currency } from '@/types/currency';
import { Transaction } from '@/types/transaction';
import { Cart } from '@shared/types/cart/Cart';

export const calculateTransaction = (cart: Partial<Cart>): Transaction => {
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
    (acc, curr) =>
      acc +
      (curr.price?.centAmount || 0) * (curr.count as number) -
      (curr.taxIncludedInPrice ? curr.taxed?.taxAmount?.centAmount || 0 : 0),
    0,
  );

  const discountedAmount = cart.lineItems.reduce(
    (acc, curr) => acc + ((curr.price?.centAmount || 0) * (curr.count as number) - (curr.totalPrice?.centAmount || 0)),
    0,
  );

  const excludedTaxes =
    cart.lineItems
      .filter((item) => !item.taxIncludedInPrice)
      .reduce((acc, curr) => acc + (curr.taxed?.taxAmount?.centAmount ?? 0), 0) +
    (!cart.shippingInfo?.taxIncludedInPrice ? cart.shippingInfo?.taxed?.taxAmount?.centAmount ?? 0 : 0);

  const totalTax = totalAmount > 0 ? cart.taxed?.taxAmount?.centAmount ?? 0 : 0;

  const isEstimatedShipping = !cart.shippingInfo;

  const totalShipping = (() => {
    let shipping;

    if (isEstimatedShipping) {
      shipping = cart.availableShippingMethods?.[0]?.rates?.[0]?.price?.centAmount || 0;
    } else {
      shipping =
        (cart.shippingInfo?.price?.centAmount || 0) -
        (cart.shippingInfo?.taxIncludedInPrice ? cart.shippingInfo?.taxed?.taxAmount?.centAmount || 0 : 0);
    }

    return shipping;
  })();

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
      isEstimated: isEstimatedShipping,
    },
    tax: {
      centAmount: totalTax / Math.pow(10, fractionDigits),
      currencyCode,
      fractionDigits,
    },
    total: {
      centAmount:
        (totalAmount + (isEstimatedShipping ? totalShipping : 0) + excludedTaxes) / Math.pow(10, fractionDigits),
      currencyCode,
      fractionDigits,
    },
  };
};
