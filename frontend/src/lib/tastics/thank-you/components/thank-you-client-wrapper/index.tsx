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
import { formatCentAmount } from '@/lib/utils/format-price';
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
          subtotal: formatCentAmount(transaction.subtotal.centAmount, transaction.subtotal.fractionDigits),
          shipping: formatCentAmount(transaction.shipping.centAmount ?? 0, transaction.shipping.fractionDigits),
          discounts: formatCentAmount(transaction.discount.centAmount, transaction.discount.fractionDigits),
          taxes: formatCentAmount(transaction.tax.centAmount ?? 0, transaction.tax.fractionDigits),
          total: formatCentAmount(transaction.total.centAmount, transaction.total.fractionDigits),
          currency: transaction.total.currencyCode,
        }}
        lineItems={(order.lineItems ?? []).map((item) =>
          mapLineItem(item, { discountCodes: order?.discountCodes ?? [] }),
        )}
        onReviewOrderClick={() => router.push(DashboardLinks.orderDetail(order.orderId ?? ''))}
        purchaseOrderNumber={order.purchaseOrderNumber}
      />
    </div>
  );
};

export default ThankYouClientWrapper;
