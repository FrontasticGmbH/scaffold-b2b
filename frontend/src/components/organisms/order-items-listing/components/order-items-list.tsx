import { FC } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import OrderItem from './order-item';
import { OrderItemsListProps } from '../types';

const OrderItemsList: FC<OrderItemsListProps> = ({ lineItems, className }) => {
  const containerClassName = classnames(
    'grid max-h-[316px] w-full grid-cols-1 divide-y divide-neutral-400 overflow-scroll',
    className,
  );

  return (
    <div className={containerClassName}>
      {lineItems.map((lineItem) => (
        <OrderItem key={lineItem.productId} lineItem={lineItem} />
      ))}
    </div>
  );
};

export default OrderItemsList;
