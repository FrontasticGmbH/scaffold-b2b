import { Currency } from '@/types/currency';
import { Order as MappedOrder, OrderStatus } from '@/types/entity/order';
import { Order } from '@shared/types/cart/Order';
import { mapLineItem } from './map-lineitem';

const orderStatus = (order: Order): OrderStatus => {
  if (order.returnInfo && order.returnInfo.length > 0) return 'Returned';
  else if (order.shipmentState === 'Delivered' || order.orderState === 'Complete') return 'Delivered';
  else if (order.orderState === 'Open') return 'Pending';
  else if (order.orderState === 'Confirmed') return 'Confirmed';
  else return 'Cancelled';
};

export const mapOrder = (order: Order): MappedOrder => {
  const currencyCode = (order.sum?.currencyCode ?? 'USD') as Currency;
  const fractionDigits = order.sum?.fractionDigits ?? 2;
  const mappedStatus = orderStatus(order);

  return {
    id: order.orderNumber ?? order.orderId ?? order.cartId,
    businessUnit: order.businessUnitKey ?? '',
    creationDate: new Date(order.createdAt ?? Date.now()).toLocaleDateString(),
    status: mappedStatus,
    items: (order.lineItems ?? []).map(mapLineItem),
    currency: currencyCode,
    subtotal:
      (order.lineItems ?? []).reduce((acc, curr) => acc + (curr.totalPrice?.centAmount ?? 0), 0) /
      Math.pow(10, fractionDigits),
    total: (order.sum?.centAmount ?? 0) / Math.pow(10, fractionDigits),
  };
};
