'use client';

import React from 'react';
import { Order } from '@shared/types/cart';
import { DataSource } from '@/types/lib/datasources';
import ThankYou from '@/components/organisms/thank-you';
import useAccount from '@/lib/hooks/useAccount';
import { mapAddress } from '@/utils/mappers/map-address';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { Address } from '@shared/types/account';
import { calculateTransaction } from '@/lib/hooks/useCart/utils';
import { TasticProps } from '../types';

const ThankYouTastic = ({ data }: TasticProps<DataSource<{ order: Order }>>) => {
  const order = data.data?.dataSource?.order;

  const { account } = useAccount();

  if (!order) return <></>;

  const transaction = calculateTransaction(order);

  return (
    <ThankYou
      account={{ email: account?.email ?? '' }}
      orderNumber={(order.orderNumber ?? '').replace(/-/g, ' ')}
      deliveryAddress={mapAddress(order.shippingAddress as Address)}
      billingAddress={mapAddress(order.billingAddress as Address)}
      transaction={{
        subtotal: transaction.subtotal.centAmount,
        shipping: transaction.shipping.centAmount,
        discounts: transaction.discount.centAmount,
        taxes: transaction.tax.centAmount,
        total: transaction.total.centAmount,
        currency: transaction.total.currencyCode,
      }}
      lineItems={(order.lineItems ?? []).map(mapLineItem)}
    />
  );
};

export default ThankYouTastic;
