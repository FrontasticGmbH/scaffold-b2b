const useDiscount = (price?: number, discountedPrice?: number) => {
  if (!price || !discountedPrice) return { isDiscounted: false, discountPercentage: 0 } as const;

  const discountPercentage = Math.floor(((price - discountedPrice) / price) * 100);

  return { isDiscounted: true, discountPercentage } as const;
};

export default useDiscount;
