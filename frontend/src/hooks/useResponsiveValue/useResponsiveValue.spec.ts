import { desktop } from '@/constants/screensizes';
import { renderHook } from '__test__/utils';
import useResponsiveValue from '.';

describe('[Hook] useResponsiveValue', () => {
  it('Returns correct value for a given responsive query', () => {
    Object.defineProperty(window, 'innerWidth', { value: desktop });

    const { lg, base, nonExistent } = renderHook(() => ({
      lg: useResponsiveValue({ base: 'base', lg: 'lg' }),
      base: useResponsiveValue({ base: 'base', lg: null }),
      nonExistent: useResponsiveValue({}),
    })).result.current;

    expect(lg).toBe('lg');
    expect(base).toBe('base');
    expect(nonExistent).toBeUndefined();
  });
});
