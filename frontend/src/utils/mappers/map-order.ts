import { Currency } from '@/types/currency';
import { Order as MappedOrder, OrderStatus } from '@/types/entity/order';
import { Order } from '@shared/types/cart/Order';
import { calculateTransaction } from '@/lib/utils/calculate-transaction';
import { BusinessUnit } from '@shared/types/business-unit';
import { mapLineItem } from './map-lineitem';

const orderStatus = (order: Order): OrderStatus => {
  if (order.shipmentState === 'Delivered' || order.orderState === 'Complete') return 'Delivered';
  else if (order.orderState === 'Open') return 'Pending';
  else if (order.orderState === 'Confirmed') return order.shipmentState === 'Shipped' ? 'Shipped' : 'Confirmed';
  else return 'Returned';
};

export const mapOrder = (order: Order, { businessUnits }: { businessUnits?: BusinessUnit[] } = {}): MappedOrder => {
  const currencyCode = (order.sum?.currencyCode ?? 'USD') as Currency;
  const mappedStatus = orderStatus(order);

  const { total, subtotal, tax, discount, shipping } = calculateTransaction(order);

  return {
    id: order.orderId ?? '',
    number: order.orderNumber ?? '',
    businessUnit: businessUnits?.find((bu) => bu.key === order.businessUnitKey)?.name ?? order.businessUnitKey ?? '',
    creationDate: order.createdAt ? new Date(order.createdAt).toISOString() : '',
    status: mappedStatus,
    items: (order.lineItems ?? []).map(mapLineItem),
    currency: currencyCode,
    taxCosts: tax.centAmount,
    subtotal: subtotal.centAmount,
    discount: discount.centAmount,
    shippingCosts: shipping.centAmount,
    total: total.centAmount,
    isFromAQuote: !!order.quoteId,
  };
};
