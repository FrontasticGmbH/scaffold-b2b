import { Discount, DiscountTarget } from '@/types/entity/discount';
import { DiscountCode } from '@shared/types/cart';

export const mapDiscountCode = (discountCode: DiscountCode): Discount => {
  return {
    discountCodeId: discountCode.discountCodeId ?? '',
    name: discountCode.name ?? '',
    code: discountCode.code ?? '',
    targets: (discountCode.discounts ?? [])
      .filter(({ target }) => target?.type === 'lineItems')
      .map(({ target }) => target as DiscountTarget),
    discounts: discountCode.discounts ?? [],
  };
};
