import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Timeline from '@/components/molecules/timeline';
import { Order } from '@/types/entity/order';
import { classnames } from '@/utils/classnames/classnames';

const OrderStatusBar = ({ order }: { order: Order }) => {
  const { translate } = useTranslation();

  const statusesTimeline = ['Confirmed', 'Shipped', 'Delivered', 'Returned'] as Array<Order['status']>;

  const orderStatusIndex = statusesTimeline.findIndex((status) => status === order.status);

  const isReturned = order.status === 'Returned';

  return (
    <Timeline activeIndex={orderStatusIndex}>
      <div className="text-left">
        <p className="text-14 font-medium text-gray-700 lg:text-16">{translate('orders.placed')}</p>
      </div>

      <div className="text-center">
        <p className="text-14 font-medium text-gray-700 lg:text-16">{translate('orders.shipped')}</p>
      </div>

      <div className={classnames(isReturned ? 'text-center' : 'text-right')}>
        <p className="text-14 font-medium text-gray-700 lg:text-16">{translate('orders.delivered')}</p>
      </div>

      {isReturned && (
        <div className="text-right">
          <p className="text-14 font-medium text-gray-700 lg:text-16">{translate('orders.returned')}</p>
        </div>
      )}
    </Timeline>
  );
};

export default OrderStatusBar;
