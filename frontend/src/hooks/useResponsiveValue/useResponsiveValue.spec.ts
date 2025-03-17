import { renderHook } from '@test/utils';
import { smallMobile, mobile, tablet, mediumDesktop, hugeDesktop } from '@/constants/screensizes';
import useResponsiveValue from './';
import useMediaQuery from '../useMediaQuery';

// Mock useMediaQuery hook
jest.mock('../useMediaQuery');

describe('[Hook] useResponsiveValue', () => {
  const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;
  const query = {
    base: 'baseValue',
    xs: 'xsValue',
    sm: 'smValue',
    md: 'mdValue',
    lg: 'lgValue',
    xl: 'xlValue',
    '2xl': '2xlValue',
    '3xl': '3xlValue',
  };

  beforeEach(() => {
    mockUseMediaQuery.mockReset();
  });

  it('should return the base value when width is less than smallMobile', () => {
    mockUseMediaQuery.mockReturnValue([300]); // Width less than smallMobile

    const { result } = renderHook(() => useResponsiveValue(query));

    expect(result.current).toBe('baseValue');
  });

  it('should return the xs value when width is greater than or equal to smallMobile', () => {
    mockUseMediaQuery.mockReturnValue([smallMobile]);

    const { result } = renderHook(() => useResponsiveValue(query));

    expect(result.current).toBe('xsValue');
  });

  it('should return the sm value when width is greater than or equal to mobile', () => {
    mockUseMediaQuery.mockReturnValue([mobile]);

    const { result } = renderHook(() => useResponsiveValue(query));

    expect(result.current).toBe('smValue');
  });

  it('should return the md value when width is greater than or equal to tablet', () => {
    mockUseMediaQuery.mockReturnValue([tablet]); // Width equals tablet

    const { result } = renderHook(() => useResponsiveValue(query));

    expect(result.current).toBe('mdValue');
  });

  it('should return the xl value when width is greater than or equal to mediumDesktop', () => {
    mockUseMediaQuery.mockReturnValue([mediumDesktop]); // Width equals mediumDesktop

    const { result } = renderHook(() => useResponsiveValue(query));

    expect(result.current).toBe('xlValue');
  });

  it('should return the 3xl value when width is greater than or equal to hugeDesktop', () => {
    mockUseMediaQuery.mockReturnValue([hugeDesktop]); // Width equals hugeDesktop

    const { result } = renderHook(() => useResponsiveValue(query));

    expect(result.current).toBe('3xlValue');
  });

  it('should return the last non-undefined value for the current screen width', () => {
    mockUseMediaQuery.mockReturnValue([mediumDesktop]);

    const query = {
      base: 'baseValue',
      xs: undefined,
      sm: 'smValue',
      md: undefined,
      lg: 'lgValue',
      xl: undefined,
      '2xl': '2xlValue',
      '3xl': undefined,
    };

    const { result } = renderHook(() => useResponsiveValue(query));

    expect(result.current).toBe('lgValue');
  });
});
