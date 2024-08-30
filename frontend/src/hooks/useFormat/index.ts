import { useCallback } from 'react';
import { Currency } from '@/types/currency';
import { Address } from '@/types/entity/address';

const useFormat = () => {
  const formatCurrency = useCallback((price: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  }, []);

  const formatAddress = useCallback((address: Partial<Address>) => {
    return `${address.name}${address.careOf ? ` (c/o ${address.careOf})` : ''}\n${address.line1}\n${address.zip} ${
      address.city
    }, ${address.country}`.replace(/[^\S\r\n]+/g, ' ');
  }, []);

  const formatLocalDate = useCallback((date: Date | string) => {
    const dateToFormat = date instanceof Date ? date : new Date(date);

    const [day, month, year] = [
      dateToFormat.getDate().toString().padStart(2, '0'),
      (dateToFormat.getMonth() + 1).toString().padStart(2, '0'),
      dateToFormat.getFullYear().toString(),
    ];

    return `${day}-${month}-${year}`;
  }, []);

  const formatPosition = useCallback((position: number) => {
    let suffix = '';

    if (position % 100 >= 10 && position % 100 <= 20) {
      suffix = 'th';
    } else {
      suffix = ['st', 'nd', 'rd'][(position % 10) - 1] ?? 'th';
    }

    return `${position}${suffix}`;
  }, []);

  return { formatCurrency, formatAddress, formatLocalDate, formatPosition };
};

export default useFormat;
