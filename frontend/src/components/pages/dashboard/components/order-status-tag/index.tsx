import React from 'react';
import { Variant as TagVariant } from '@/components/atoms/tag/types';
import Tag from '@/components/atoms/tag';
import { OrderStatus } from '@/types/entity/order';
import { useTranslations } from 'use-intl';
import { OrderStatusTagProps } from './types';

const OrderStatusTag = ({ status }: OrderStatusTagProps) => {
  const translate = useTranslations();

  const statusVariant = {
    Placed: 'primary',
    Pending: 'warning',
    Confirmed: 'light',
    Cancelled: 'danger',
    Rejected: 'danger',
    Returned: 'secondary',
    Delivered: 'success',
    Shipped: 'light',
  } as Record<OrderStatus, TagVariant>;

  return (
    <Tag className="capitalize" variant={statusVariant[status]}>
      {translate(`orders.status-${status.toLowerCase()}` as Parameters<typeof translate>[0])}
    </Tag>
  );
};

export default OrderStatusTag;
