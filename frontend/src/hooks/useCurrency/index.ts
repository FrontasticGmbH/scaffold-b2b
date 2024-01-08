import { Location } from '@/components/organisms/shipping-and-language/types';
import { useShipAndLanguage } from '@/providers/ship-and-language';
import { Currency } from '@/types/currency';

const useCurrency = () => {
  const { selectedLocation } = useShipAndLanguage();

  const locationBasedCurrency: { [k: Location['value']]: Currency } = {
    sv: 'SEK',
    en: 'USD',
  };

  return locationBasedCurrency[selectedLocation?.value ?? 'en'];
};

export default useCurrency;
