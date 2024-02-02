import { Currency } from '@/types/currency';
import { Order as MappedOrder, OrderStatus } from '@/types/entity/order';
import { Order } from '@shared/types/cart/Order';
import { mapLineItem } from './map-lineitem';

const orderStatus = (order: Order): OrderStatus => {
  if (order.shipmentState === 'Delivered' || order.orderState === 'Complete') return 'Delivered';
  else if (order.orderState === 'Open') return 'Pending';
  else if (order.orderState === 'Confirmed') return order.shipmentState === 'Shipped' ? 'Shipped' : 'Confirmed';
  else return 'Returned';
};

export const mapOrder = (order: Order): MappedOrder => {
  const currencyCode = (order.sum?.currencyCode ?? 'USD') as Currency;
  const fractionDigits = order.sum?.fractionDigits ?? 2;
  const mappedStatus = orderStatus(order);

  return {
    id: order.orderId ?? '',
    number: order.orderNumber ?? '',
    businessUnit: order.businessUnitKey ?? '',
    creationDate: new Date(order.createdAt ?? Date.now()).toLocaleDateString(),
    status: mappedStatus,
    items: (order.lineItems ?? []).map(mapLineItem),
    currency: currencyCode,
    subtotal:
      (order.lineItems ?? []).reduce((acc, curr) => acc + (curr.totalPrice?.centAmount ?? 0), 0) /
      Math.pow(10, fractionDigits),
    shippingCosts: (order.shippingInfo?.price?.centAmount ?? 0) / Math.pow(10, fractionDigits),
    total: (order.sum?.centAmount ?? 0) / Math.pow(10, fractionDigits),
  };
};
