import { Currency } from '@/types/currency';
import { Transaction } from '@/types/transaction';
import { ShippingRate } from '@shared/types/cart';
import { Cart } from '@shared/types/cart/Cart';

/**
 * Calculates transaction totals from a Commerce Tools cart
 *
 * Key features:
 * - Handles tax-inclusive pricing correctly
 * - Calculates subtotal before any discounts for UI display
 * - Provides detailed discount segments for UI display
 *
 * @param cart Partial cart object from Commerce Tools API
 * @returns Transaction object with all calculated amounts in centAmount
 */
export const calculateTransaction = (cart: Partial<Cart>): Transaction => {
  // Early return for empty cart
  if (!cart.lineItems) {
    return {
      subtotal: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
      discount: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2, segments: [] },
      tax: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
      shipping: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
      total: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
    };
  }

  const currencyCode = (cart.sum?.currencyCode ?? 'USD') as Currency;
  const fractionDigits = cart.sum?.fractionDigits ?? 2;

  const cartGrossTotal = cart.sum?.centAmount || 0;

  // Mode: When taxes are calculated on the cart, we operate on NET for line-item math
  const isTaxNetMode = !!cart.taxed;

  // Local helper types and functions for reuse
  type LineItemLike = NonNullable<Cart['lineItems']>[number];
  const toNet = (unitPrice: number, item: Partial<LineItemLike>): number => {
    const rate = item.taxRate?.amount ?? null;
    const included = item.taxRate?.includedInPrice ?? false;

    return isTaxNetMode && included && rate !== null ? Math.floor(unitPrice / (1 + rate)) : unitPrice;
  };

  // Helper: Calculate subtotal before any discounts or taxes
  // If cart.taxed exists, convert unit prices that include tax to NET via divide by (1 + rate)
  // Otherwise, treat unit prices as NET (typical for tax-exclusive markets)
  function calculateSubtotalBeforeDiscounts(cart: Partial<Cart>): number {
    if (!cart.lineItems) {
      return 0;
    }

    if (isTaxNetMode) {
      return cart.lineItems.reduce((sum, item) => {
        const unitPrice = item.price?.centAmount ?? 0;
        const unitNet = toNet(unitPrice, item);
        const count = item.count || 1; // at least 1 if there is a lineItem
        const totalOriginalPrice = unitNet * count;
        return sum + totalOriginalPrice;
      }, 0);
    }

    return cart.lineItems.reduce((sum, item) => {
      const originalAmount = item.price?.centAmount || 0;
      const count = item.count || 1; // if there is a lineItem, there is one item at least
      const totalOriginalPrice = originalAmount * count;
      return sum + totalOriginalPrice;
    }, 0);
  }

  // Helper: Calculate discount codes per line item
  function calculateDiscountCodesAmount(cart: Partial<Cart>): Record<string, number> {
    if (!cart.lineItems) return {};

    return cart.lineItems.reduce(
      (acc, curr) => {
        const discountCodes: Record<string, number> = {};

        for (const discountedPrice of curr.discountedPricePerCount ?? []) {
          for (const includedDiscount of discountedPrice.discountedPrice?.includedDiscounts ?? []) {
            const appliedDiscountCode = cart.discountCodes?.find((code) =>
              (code.discounts ?? []).map((d) => d.cartDiscountId).includes(includedDiscount.discount.cartDiscountId),
            );

            if (appliedDiscountCode?.code) {
              // Convert discount amounts to NET when cart has taxes and item prices include tax
              const grossPerUnit = includedDiscount.discountedAmount.centAmount ?? 0;
              const netPerUnit = toNet(grossPerUnit, curr);
              discountCodes[appliedDiscountCode.code] =
                (discountCodes[appliedDiscountCode.code] || 0) + netPerUnit * (discountedPrice.count ?? 1);
            }
          }
        }

        return { ...acc, ...discountCodes };
      },
      {} as Record<string, number>,
    );
  }

  // Helper: Calculate total discounts on line items
  function calculateTotalDiscounts(cart: Partial<Cart>): number {
    if (!cart.lineItems) return 0;

    // Compute discounts consistently on a NET basis when taxes are present.
    if (isTaxNetMode) {
      const originalNet = cart.lineItems.reduce((sum, item) => {
        const unitPrice = item.price?.centAmount ?? 0;
        const unitNet = toNet(unitPrice, item);
        const count = item.count || 1;
        return sum + unitNet * count;
      }, 0);

      const discountedNet = cart.lineItems.reduce((sum, item) => {
        const netAfterDiscounts = item.taxed?.netAmount?.centAmount ?? item.totalPrice?.centAmount ?? 0;
        return sum + netAfterDiscounts;
      }, 0);

      const lineItemDiscountsNet = originalNet - discountedNet;

      // Add cart-level discount on total price, if any
      const cartLevelDiscount = cart.discountOnTotalPrice?.discountedAmount.centAmount ?? 0;
      return lineItemDiscountsNet + cartLevelDiscount;
    }

    // No taxes calculated: treat price/totalPrice as NET values (e.g., US)
    const lineItemDiscounts = cart.lineItems.reduce((acc, item) => {
      const originalTotal = (item.price?.centAmount || 0) * (item.count || 0);
      const discountedTotal = item.totalPrice?.centAmount || 0;
      return acc + (originalTotal - discountedTotal);
    }, 0);

    return lineItemDiscounts + (cart.discountOnTotalPrice?.discountedAmount.centAmount ?? 0);
  }

  // Helper: Calculate shipping cost
  function calculateShipping(cart: Partial<Cart>): {
    amount: number;
    isEstimated: boolean;
    freeAbove?: number;
    rate?: ShippingRate;
  } {
    const isEstimated = !cart.shippingInfo;

    if (isEstimated) {
      return {
        amount: 0,
        isEstimated: true,
      };
    }

    // Actual shipping cost
    const shippingPrice = cart.shippingInfo?.price?.centAmount || 0;

    return {
      amount: shippingPrice,
      isEstimated: false,
      freeAbove: cart.shippingInfo?.rate?.freeAbove?.centAmount,
      rate: cart.shippingInfo?.rate,
    };
  }

  // Calculate all components
  const subtotalBeforeDiscounts = calculateSubtotalBeforeDiscounts(cart);
  const discountCodesAmount = calculateDiscountCodesAmount(cart);
  const discountedAmount = calculateTotalDiscounts(cart);

  const {
    amount: totalShipping,
    isEstimated: isEstimatedShipping,
    freeAbove: shippingFreeAbove,
    rate: shippingRate,
  } = calculateShipping(cart);

  // Calculate discount segments for UI display (NET basis when taxes are present)
  const totalItemSavings =
    (cart.lineItems ?? []).reduce((acc, item) => {
      if (item.isGift) return acc;

      const unitPrice = item.price?.centAmount ?? 0;
      const unitNet = toNet(unitPrice, item);

      const count = item.count ?? 1;
      const originalNet = unitNet * count;
      const discountedNet = item.taxed?.netAmount?.centAmount ?? item.totalPrice?.centAmount ?? 0;
      const saving = Math.max(originalNet - discountedNet, 0);
      return acc + saving;
    }, 0) - Object.values(discountCodesAmount).reduce((acc, curr) => acc + curr, 0);

  const giftItemSavings = (cart.lineItems ?? [])
    .filter((item) => item.isGift)
    .reduce((acc, item) => {
      const unitPrice = item.price?.centAmount ?? 0;
      const unitNet = toNet(unitPrice, item);
      const count = item.count ?? 1;
      return acc + unitNet * count;
    }, 0);

  // Calculate cart subtotal (before shipping and taxes) for free shipping threshold
  const cartSubtotalForFreeShipping = subtotalBeforeDiscounts - discountedAmount;

  // Only calculate shipping savings if there's a real discount (e.g., free shipping threshold met)
  // Not when the difference is just due to tax calculation
  let shippingSavings = 0;
  if (shippingFreeAbove && cartSubtotalForFreeShipping >= shippingFreeAbove && totalShipping === 0) {
    // Free shipping threshold met
    shippingSavings = shippingRate?.price?.centAmount ?? 0;
  }

  // Helper: Calculate total tax from line items only (excludes shipping tax)
  function calculateLineItemsTax(cart: Partial<Cart>): number {
    if (!cart.lineItems) {
      return 0;
    }

    return cart.lineItems.reduce((sum, item) => {
      const itemTax = item.taxed?.taxAmount?.centAmount || 0;
      return sum + itemTax;
    }, 0);
  }

  return {
    subtotal: {
      centAmount: subtotalBeforeDiscounts,
      currencyCode,
      fractionDigits,
    },
    discount: {
      centAmount: discountedAmount,
      currencyCode,
      fractionDigits,
      segments: [
        // Sale item savings
        ...(totalItemSavings > 0
          ? [
              {
                source: '',
                label: 'cart.sale-item-savings',
                value: {
                  type: 'absolute' as const,
                  value: totalItemSavings,
                },
                discountedAmount: totalItemSavings,
              },
            ]
          : []),
        // Gift item savings
        ...(giftItemSavings > 0
          ? [
              {
                source: '',
                label: 'cart.buy-get-promo',
                value: {
                  type: 'absolute' as const,
                  value: giftItemSavings,
                },
                discountedAmount: giftItemSavings,
              },
            ]
          : []),
        // Cart-level discounts
        ...(cart.discountOnTotalPrice?.includedDiscounts ?? []).map((discount) => ({
          source:
            cart.discountCodes?.find(
              (code) => !!code.discounts?.find((d) => d.cartDiscountId === discount.discount.cartDiscountId),
            )?.code ?? '',
          label: discount.discount.name ?? '',
          value: {
            type: discount.discount.discountValue?.type ?? 'absolute',
            value: (() => {
              switch (discount.discount.discountValue?.type) {
                case 'absolute':
                case 'fixed':
                  return discount.discount.discountValue.value.centAmount ?? 0;
                case 'relative':
                  return discount.discount.discountValue.value ?? 0;
                default:
                  return 0;
              }
            })(),
          },
          discountedAmount: discount.discountedAmount.centAmount ?? 0,
          targetsTotal: discount.discount.target?.type === 'totalPrice',
        })),
        // Discount codes
        ...Object.entries(discountCodesAmount).map(([code, amount]) => ({
          source: '',
          label: code,
          value: {
            type: 'absolute' as const,
            value: amount,
          },
          discountedAmount: amount,
        })),
        // Shipping discounts
        ...(shippingSavings > 0
          ? [
              {
                source: '',
                label: '',
                value: {
                  type: 'relative' as const,
                  value: (1 - (totalShipping ?? 0) / (shippingRate?.price?.centAmount ?? 1)) * 100,
                },
                discountedAmount: shippingSavings,
                targetsShipping: true,
              },
            ]
          : []),
      ],
    },
    shipping: {
      centAmount: cart.shippingInfo?.taxed?.grossAmount?.centAmount ?? totalShipping,
      currencyCode,
      fractionDigits,
      isEstimated: isEstimatedShipping,
      freeAbove: shippingFreeAbove,
      includesTaxes: !!cart.shippingInfo?.taxRate?.includedInPrice,
    },
    tax: {
      centAmount: calculateLineItemsTax(cart),
      currencyCode,
      fractionDigits,
    },
    total: {
      centAmount: cart.taxed?.grossAmount?.centAmount ?? cartGrossTotal, // gross amount includes taxes and shipping
      currencyCode,
      fractionDigits,
    },
  };
};
