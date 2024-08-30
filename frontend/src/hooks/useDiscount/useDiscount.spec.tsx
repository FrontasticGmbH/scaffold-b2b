import { renderHook } from '__test__/utils';
import useDiscount from '.';

describe('useDiscount', () => {
  it('should add no discounts when the price or discountedPrice is empty', () => {
    const { result } = renderHook(() => useDiscount(100));

    expect(result.current.discountPercentage).toBe(0);
    expect(result.current.isDiscounted).toBe(false);
  });

  it('should apply discount when the price and discountedPrice have values', () => {
    const { result } = renderHook(() => useDiscount(100, 92));
    expect(result.current.discountPercentage).toBe(8);
    expect(result.current.isDiscounted).toBe(true);
  });
});
