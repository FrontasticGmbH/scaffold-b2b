import { renderHook } from '@testing-library/react';
import { cva } from '@/utils/classnames/cva';
import { classnames } from '@/utils/classnames/classnames';
import useClassNames from './';

// Mock the utilities
jest.mock('@/utils/classnames/cva', () => ({
  cva: jest.fn(),
}));

jest.mock('@/utils/classnames/classnames', () => ({
  classnames: jest.fn(),
}));

describe('useClassNames Hook', () => {
  const mockCva = cva as jest.Mock;
  const mockClassnames = classnames as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCva.mockImplementation((styles) => (key: string) => {
      return styles.intent[key.split('.')[1]];
    });

    mockClassnames.mockImplementation((...args) => args.join(' '));
  });

  it('returns correct class names for the "primary" variant', () => {
    const { result } = renderHook(() => useClassNames({ variant: 'primary' }));

    expect(mockCva).toHaveBeenCalledTimes(2);
    expect(mockCva).toHaveBeenCalledWith({
      intent: {
        primary: 'bg-blue-100',
        warning: 'bg-yellow-100',
      },
    });
    expect(mockCva).toHaveBeenCalledWith({
      intent: {
        primary: 'bg-blue-500',
        warning: 'bg-yellow-500',
      },
    });

    expect(result.current.bannerClassName).toContain(
      'flex items-stretch gap-3 overflow-hidden rounded-md md:gap-4 lg:gap-5',
    );
    expect(result.current.bannerClassName).toContain('bg-blue-100');
    expect(result.current.sidebarClassName).toContain('block w-[8px] shrink-0');
    expect(result.current.sidebarClassName).toContain('bg-blue-500');
  });

  it('returns correct class names for the "warning" variant', () => {
    const { result } = renderHook(() => useClassNames({ variant: 'warning' }));

    expect(mockCva).toHaveBeenCalledTimes(2);

    expect(result.current.bannerClassName).toContain('bg-yellow-100');
    expect(result.current.sidebarClassName).toContain('bg-yellow-500');
  });

  it('handles undefined variant correctly', () => {
    const { result } = renderHook(() => useClassNames({ variant: undefined }));

    expect(mockCva).toHaveBeenCalledTimes(2);

    expect(result.current.bannerClassName).toContain(
      'flex items-stretch gap-3 overflow-hidden rounded-md md:gap-4 lg:gap-5',
    );
    expect(result.current.sidebarClassName).toContain('block w-[8px] shrink-0');
  });

  it('uses classnames utility to combine classes', () => {
    renderHook(() => useClassNames({ variant: 'primary' }));

    expect(mockClassnames).toHaveBeenCalledWith(
      'flex items-stretch gap-3 overflow-hidden rounded-md md:gap-4 lg:gap-5',
      'bg-blue-100',
    );

    expect(mockClassnames).toHaveBeenCalledWith('block w-[8px] shrink-0', 'bg-blue-500');
  });
});
