import React, { useMemo } from 'react';
import { CheckCircleIcon as StockIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import { StockIndicatorProps } from './types';

const StockIndicator = ({ inStock, restockableInDays }: StockIndicatorProps) => {
  const translate = useTranslations();

  const formattedRestockable = useMemo(() => {
    if (restockableInDays === undefined || isNaN(restockableInDays)) return;

    if (restockableInDays <= 6) {
      const days = Math.max(1, restockableInDays);

      return `${translate('common.available-in')} ${days} ${translate(days === 1 ? 'common.day' : 'common.days')}`;
    }

    if (restockableInDays <= 29) {
      const weeks = Math.max(1, Math.ceil(restockableInDays / 7));

      return `${translate('common.available-in')} ${weeks} ${translate(weeks === 1 ? 'common.week' : 'common.weeks')}`;
    }

    const months = Math.max(1, Math.ceil(restockableInDays / 30));

    return `${translate('common.available-in')} ${months} ${translate(
      months === 1 ? 'common.month' : 'common.months',
    )}`;
  }, [restockableInDays, translate]);

  return (
    <div className="flex items-center gap-2 whitespace-pre text-14 text-gray-700">
      {inStock ? (
        <>
          <StockIcon className="text-primary" width={20} />
          <span>{translate('common.in-stock')}</span>
        </>
      ) : (
        <>
          {formattedRestockable ? (
            <>
              <StockIcon className="text-yellow-500" width={20} />
              <span>{formattedRestockable}</span>
            </>
          ) : (
            <>
              <StockIcon className="text-red-500" width={20} />
              <span>{translate('common.out-of-stock')}</span>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StockIndicator;
