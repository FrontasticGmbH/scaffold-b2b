import { ProductDiscount } from '@/types/entity/product';

const useDiscount = (price?: number, discountedPrice?: number, discount?: ProductDiscount) => {
  if (!price || discountedPrice === undefined || discountedPrice >= price)
    return { isDiscounted: false, discountPercentage: 0, discount: undefined } as const;

  if (discountedPrice === 0 && !discount)
    return { isDiscounted: false, discountPercentage: 0, discount: undefined } as const;

  const discountPercentage = Math.floor(((price - discountedPrice) / price) * 100);

  return { isDiscounted: true, discountPercentage, discount } as const;
};

export default useDiscount;
