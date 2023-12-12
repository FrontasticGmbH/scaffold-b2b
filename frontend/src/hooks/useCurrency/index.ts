import { Location } from '@/components/organisms/shipping-and-language/types';
import { useShipAndLanguage } from '@/providers/ship-and-language';

const useCurrency = () => {
  const { selectedLocation } = useShipAndLanguage();

  type Currency = 'SEK' | 'USD';

  const locationBasedCurrency: { [k: Location['value']]: Currency } = {
    sv: 'SEK',
    en: 'USD',
  };

  return locationBasedCurrency[selectedLocation?.value ?? 'en'];
};

export default useCurrency;
