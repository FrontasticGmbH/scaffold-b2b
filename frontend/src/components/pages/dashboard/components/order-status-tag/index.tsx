import React from 'react';
import { Variant as TagVariant } from '@/components/atoms/tag/types';
import Tag from '@/components/atoms/tag';
import { OrderStatus } from '@/types/entity/order';
import { OrderStatusTagProps } from './types';

const OrderStatusTag = ({ status }: OrderStatusTagProps) => {
  const statusVariant = {
    confirmed: 'warning',
    cancelled: 'danger',
    returned: 'primary',
    delivered: 'success',
  } as Record<OrderStatus, TagVariant>;

  return (
    <Tag className="capitalize" variant={statusVariant[status]}>
      {status}
    </Tag>
  );
};

export default OrderStatusTag;
