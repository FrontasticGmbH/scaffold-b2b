import { useShipAndLanguage } from '@/providers/ship-and-language';
import { Currency } from '@/types/currency';

const useCurrency = () => {
  const { selectedLocation } = useShipAndLanguage();

  const locationBasedCurrency = {
    us: 'USD',
    gb: 'GBP',
    au: 'AUD',
    nz: 'NZD',
    de: 'EUR',
    fr: 'EUR',
    es: 'EUR',
    pt: 'EUR',
    nl: 'EUR',
    it: 'EUR',
  } as Record<string, Currency>;

  return locationBasedCurrency[selectedLocation?.value ?? 'us'];
};

export default useCurrency;
