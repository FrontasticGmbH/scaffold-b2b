'use client';

import React from 'react';
import useCustomRouter from '@/hooks/useCustomRouter';
import { Order } from '@shared/types/cart';
import { DataSource } from '@/types/lib/datasources';
import ThankYou from '@/components/organisms/thank-you';
import useAccount from '@/lib/hooks/useAccount';
import { mapAddress } from '@/utils/mappers/map-address';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { Address } from '@shared/types/account';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import { calculateTransaction } from '@/lib/utils/calculate-transaction';
import { TasticProps } from '@/lib/tastics/types';

const ThankYouClientWrapper = ({ data }: TasticProps<DataSource<{ order: Order }>>) => {
  const router = useCustomRouter();

  const { account } = useAccount();

  const order = data.data?.dataSource?.order;

  if (!order) return <></>;

  const transaction = calculateTransaction(order);

  return (
    <div data-testid={`order-${order.orderId}`}>
      <ThankYou
        orderId={order.orderId}
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
        onReviewOrderClick={() => router.push(DashboardLinks.orderDetail(order.orderId ?? ''))}
        purchaseOrderNumber={order.purchaseOrderNumber}
      />
    </div>
  );
};

export default ThankYouClientWrapper;
