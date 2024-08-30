import { act, renderHook } from '__test__/utils';
import { bigDesktop, desktop } from '@/constants/screensizes';
import useMediaQuery from '.';

describe('useMediaQuery', () => {
  it('should return an array', () => {
    const { result } = renderHook(() => useMediaQuery());
    expect(Array.isArray(result.current)).toBeTruthy();
  });

  it('should return one value when a breaking point is not passed', () => {
    const { result } = renderHook(() => useMediaQuery());

    expect(result.current.length).toBe(1);
    // The default window width in the test environment is same as a desktop with
    expect(result.current[0]).toBe(desktop);
  });

  it('should return correct values when the window is resized', () => {
    const { result } = renderHook(() => useMediaQuery(desktop));

    window.innerWidth = bigDesktop;
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    const [isLargerThanDesktop, width] = result.current;

    expect(isLargerThanDesktop).toBeTruthy();
    expect(width).toBe(bigDesktop);
  });
});
