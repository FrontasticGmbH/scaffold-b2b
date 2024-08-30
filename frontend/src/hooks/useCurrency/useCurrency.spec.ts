import { useShipAndLanguage } from '@/providers/ship-and-language';
import { renderHook } from '@test/utils';
import useCurrency from '.';

jest.mock('@/providers/ship-and-language');

describe('[Hook] useCurrency', () => {
  it('Selects the correct currency based on active location', async () => {
    //eslint-disable-next-line
    (useShipAndLanguage as jest.Mock<any, any, any>).mockReturnValue({ selectedLocation: { value: 'us' } });

    const { result, rerender } = renderHook(useCurrency);

    expect(result.current).toBe('USD');

    //eslint-disable-next-line
    (useShipAndLanguage as jest.Mock<any, any, any>).mockReturnValue({ selectedLocation: { value: 'de' } });

    rerender();

    expect(result.current).toBe('EUR');
  });
});
