import { useMemo } from 'react';
import { Money } from '@shared/types/product/Money';
import { useTranslations } from 'use-intl';
import { CostRef, UseCostsData } from '../types';

const useCostsData: UseCostsData = ({ dataReference = 'cart', order }) => {
  const translate = useTranslations();

  const skeletonMoney: Money = useMemo(() => {
    return { fractionDigits: 2, centAmount: 999, currencyCode: 'USD' };
  }, []);

  const skeletonCosts = useMemo(
    () => [
      {
        key: 'subtotal',
        label: translate('cart.subtotal'),
        value: skeletonMoney,
      },
      {
        key: 'shipping',
        label: translate('cart.shipping-estimate'),
        value: skeletonMoney,
      },
      {
        key: 'tax',
        label: translate('cart.tax'),
        value: skeletonMoney,
      },
      {
        key: 'discount',
        label: translate('cart.discount'),
        value: skeletonMoney,
      },
    ],
    [skeletonMoney, translate],
  ) as CostRef[];

  const total: CostRef = {
    key: 'total',
    label: translate('cart.total'),
    value: dataReference === 'cart' ? skeletonMoney : (order?.sum as Money),
  };

  return { loading: false, costsToRender: skeletonCosts, total };
};

export default useCostsData;
