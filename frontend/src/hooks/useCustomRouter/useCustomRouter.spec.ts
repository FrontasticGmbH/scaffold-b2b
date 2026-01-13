import { act, renderHook } from '@test/utils';
import useCustomRouter from '.';

describe('[Hook] useCustomRouter', () => {
  let mockPush: jest.Mock;
  let mockReplace: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockReplace = jest.fn();

    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
  });

  test('should navigate to the correct route', () => {
    const { result } = renderHook(() => useCustomRouter());

    act(() => {
      result.current.push('/expected-route');
    });

    expect(mockPush).toHaveBeenCalledWith('/en/expected-route', {});
  });

  test('should navigate to the correct route with custom locale', () => {
    const { result } = renderHook(() => useCustomRouter());

    act(() => {
      result.current.push('/expected-route', { locale: 'es' });
    });

    expect(mockPush).toHaveBeenCalledWith('/es/expected-route', {});
  });

  test('should replace the correct route', () => {
    const { result } = renderHook(() => useCustomRouter());

    act(() => {
      result.current.replace('/expected-route');
    });

    expect(mockReplace).toHaveBeenCalledWith('/en/expected-route', {});
  });

  test('should replace with custom locale', () => {
    const { result } = renderHook(() => useCustomRouter());

    act(() => {
      result.current.replace('/expected-route', { locale: 'fr' });
    });

    expect(mockReplace).toHaveBeenCalledWith('/fr/expected-route', {});
  });
});
