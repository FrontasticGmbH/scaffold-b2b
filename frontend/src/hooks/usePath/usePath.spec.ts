import * as nextNavigation from 'next/navigation';
import { renderHook } from '@testing-library/react';
import usePath from '.';

describe('[Hook] usePath', () => {
  const mockUsePathname = jest.spyOn(nextNavigation, 'usePathname');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should correctly process a pathname with multiple segments and a query string', () => {
    mockUsePathname.mockReturnValue('/en/account/settings?tab=profile');

    const { result } = renderHook(() => usePath());

    expect(result.current).toEqual({
      absolutePath: '/en/account/settings?tab=profile',
      path: '/account/settings?tab=profile',
      pathWithoutQuery: '/account/settings',
    });
  });

  test('should correctly process a simple pathname without a query string', () => {
    mockUsePathname.mockReturnValue('/en');

    const { result } = renderHook(() => usePath());

    expect(result.current).toEqual({
      absolutePath: '/en',
      path: '/',
      pathWithoutQuery: '/',
    });
  });

  test('should correctly handle the root path', () => {
    mockUsePathname.mockReturnValue('/');

    const { result } = renderHook(() => usePath());

    expect(result.current).toEqual({
      absolutePath: '/',
      path: '/',
      pathWithoutQuery: '/',
    });
  });

  test('should correctly handle a pathname with a single segment and a query string', () => {
    mockUsePathname.mockReturnValue('/en/?tab=home');

    const { result } = renderHook(() => usePath());

    expect(result.current).toEqual({
      absolutePath: '/en/?tab=home',
      path: '/?tab=home',
      pathWithoutQuery: '/',
    });
  });
});
