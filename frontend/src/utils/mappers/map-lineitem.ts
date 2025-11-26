import { DiscountTarget } from '@/types/entity/discount';
import { Product, PerCountDiscount } from '@/types/entity/product';
import { DiscountCode } from '@shared/types/cart';
import { LineItem } from '@shared/types/cart/LineItem';

interface Options {
  discountCodes?: DiscountCode[];
}

export const mapLineItem = (lineItem: LineItem, { discountCodes = [] }: Options = {}): Product => {
  const variant = lineItem.variant;

  // Original price with tax included (if applicable)
  const originalPrice = lineItem.price?.centAmount ?? variant?.price?.centAmount ?? 0;

  const discountedPrice = lineItem.discountedPrice?.value?.centAmount ?? variant?.discountedPrice?.value?.centAmount;
  const currency = lineItem.price?.currencyCode ?? variant?.price?.currencyCode ?? 'USD';

  const discountCode = discountCodes.find((code) =>
    (code.discounts ?? [])
      .filter(({ target }) => target?.type === 'lineItems')
      .map(({ target }) => target as DiscountTarget)
      ?.find((target) => target.predicate.includes(lineItem.variant?.sku ?? '')),
  );

  let actualDiscountedPrice = discountedPrice;

  if (
    !actualDiscountedPrice &&
    (lineItem.totalPrice?.centAmount ?? 0) / (lineItem.count ?? 1) < (lineItem.price?.centAmount ?? 0)
  ) {
    actualDiscountedPrice = (lineItem.totalPrice?.centAmount ?? 0) / (lineItem.count ?? 1);
  }

  const discount = lineItem.discountedPrice?.discount ?? variant?.discountedPrice?.discount;
  const discountValue = discount?.discountValue;

  let discountType: 'relative' | 'absolute' | undefined;
  let discountAmount: number | undefined;

  if (discountValue) {
    if (discountValue.type === 'relative') {
      discountType = 'relative';
      discountAmount = discountValue.value / 100;
    } else if (discountValue.type === 'absolute') {
      discountType = 'absolute';
      discountAmount = (discountValue.value?.centAmount ?? 0) / 100;
    }
  }

  return {
    id: lineItem.lineItemId,
    url: lineItem._url,
    sku: variant?.sku,
    name: lineItem.name,
    description: variant?.attributes?.['Product-Specifications'],
    images: variant?.images,
    quantity: lineItem.count,
    price: originalPrice / 100,
    ...(actualDiscountedPrice ? { discountedPrice: actualDiscountedPrice / 100 } : {}),
    discountPercentage: actualDiscountedPrice ? ((originalPrice - actualDiscountedPrice) / originalPrice) * 100 : 0,
    currency,
    inStock: variant?.isOnStock,
    maxQuantity: variant?.isOnStock ? variant.availableQuantity : 0,
    isGift: lineItem.isGift,
    discountCode,
    ...(discount
      ? {
          discount: {
            name: discount.name ?? '',
            description: discount.description ?? '',
            type: discountType,
            value: discountAmount,
          },
        }
      : {}),
    discountsAppliedPerCount: (lineItem.discountedPricePerCount ?? []).map((dpc) => ({
      count: dpc.count ?? lineItem.count,
      details: {
        totalDiscountedPrice: (dpc.discountedPrice?.value.centAmount ?? 0) / 100,
        includedDiscounts: (dpc.discountedPrice?.includedDiscounts ?? []).map((discount) => ({
          discountedAmount: (discount.discountedAmount.centAmount ?? 0) / 100,
          discount: {
            name: discount.discount?.name ?? '',
            description: discount.discount?.description ?? '',
          },
        })),
      },
    })),
  } as Product;
};
