import React from 'react';
import { Variant as TagVariant } from '@/components/atoms/tag/types';
import Tag from '@/components/atoms/tag';
import { OrderStatus } from '@/types/entity/order';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { OrderStatusTagProps } from './types';

const OrderStatusTag = ({ status }: OrderStatusTagProps) => {
  const { translate } = useTranslation();

  const statusVariant = {
    Pending: 'warning',
    Confirmed: 'primary',
    Cancelled: 'danger',
    Returned: 'secondary',
    Delivered: 'success',
    Shipped: 'primary',
  } as Record<OrderStatus, TagVariant>;

  return (
    <Tag className="capitalize" variant={statusVariant[status]}>
      {translate(`orders.status.${status.toLowerCase()}`)}
    </Tag>
  );
};

export default OrderStatusTag;
