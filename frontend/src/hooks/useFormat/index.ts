import { useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Currency } from '@/types/currency';

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

  return { formatCurrency };
};

export default useFormat;
