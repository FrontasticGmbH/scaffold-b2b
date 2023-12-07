import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Currency } from '@/types/currency';
import { Address } from '@/types/entity/address';

const useFormat = () => {
  const { locale } = useParams();

  const formatCurrency = useCallback(
    (price: number, currency: Currency) => {
      const intlLocaleMapping = { en: 'en-US', sv: 'sv-SE' };

      return new Intl.NumberFormat(intlLocaleMapping[locale as keyof typeof intlLocaleMapping], {
        style: 'currency',
        currency,
      }).format(price);
    },
    [locale],
  );

  const formatAddress = useCallback((address: Address) => {
    return `${address.name} ${address.careOf ? `(c/o ${address.careOf})` : ''}\n${address.line1}\n${address.zip} ${
      address.city
    }, ${address.country}`.replace(/[^\S\r\n]+/g, ' ');
  }, []);

  return { formatCurrency, formatAddress };
};

export default useFormat;
