import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Image from '@/components/atoms/Image';
import useFormat from '@/hooks/useFormat';
import Link from '@/components/atoms/link';
import Typography from '@/components/atoms/typography';
import Button from '@/components/atoms/button';
import { OrderDetailsPageProps } from './types';
import OrderStatusBar from './components/order-status-bar';

const OrderDetailsPage = ({ order }: OrderDetailsPageProps) => {
  const { translate } = useTranslation();

  const { formatCurrency } = useFormat();

  if (!order) return <></>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
          {translate('dashboard.order.details')}
        </h1>
        <div className="hidden items-center justify-normal gap-x-3 md:flex">
          <Link href="?hash=orders" underlineOnHover className="hidden text-blue-700 lg:block">
            <Typography className="text-14 text-blue-700">{translate('common.back.to.previous')}</Typography>
          </Link>
          <Button size="s" variant="secondary">
            {translate('orders.return')}
          </Button>
          <Button size="s" variant="secondary">
            {translate('orders.download.invoice')}
          </Button>
          <Button size="s" variant="primary">
            {translate('orders.reorder')}
          </Button>
        </div>
      </div>
      <h3 className="text-14 text-gray-600">
        {translate('dashboard.order.id')}: {order.id}
      </h3>

      <OrderStatusBar />

      <div className="flex flex-col items-center justify-normal gap-y-4 md:hidden">
        <Link href="?hash=orders" underlineOnHover className="hidden text-blue-700 lg:block">
          <Typography className="text-14 text-blue-700">{translate('common.back.to.previous')}</Typography>
        </Link>
        <Button size="full" variant="secondary">
          {translate('orders.return')}
        </Button>
        <Button size="full" variant="secondary">
          {translate('orders.download.invoice')}
        </Button>
        <Button size="full" variant="primary">
          {translate('orders.reorder')}
        </Button>
      </div>

      <div>
        <h5 className="pb-7 pt-6 text-gray-700">
          {translate('dashboard.items.ordered')} <span className="text-gray-600">({order.items.length})</span>
        </h5>

        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-400 p-4 text-12 font-semibold uppercase text-gray-500">
              <th className="p-4 text-left">{translate('common.product')}</th>
              <th className="hidden p-4 text-left md:table-cell">{translate('common.sku')}</th>
              <th className="hidden p-4 text-right md:table-cell">{translate('common.qty')}</th>
              <th className="hidden p-4 text-right lg:table-cell">{translate('common.price')}</th>
              <th className="hidden p-4 text-right lg:table-cell">{translate('common.total')}</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(({ id, image, name, sku, quantity, price, currency }) => (
              <tr key={id} className="border-b border-neutral-400 p-4 text-14 text-gray-600">
                <td className="p-4 text-left">
                  <div className="flex items-center gap-3">
                    <span className="relative block h-[40px] w-[40px]">
                      <Image src={image} fill alt={name ?? ''} />
                    </span>
                    <span>{name}</span>
                  </div>
                </td>
                <td className="hidden p-4 text-left md:table-cell">{sku}</td>
                <td className="hidden p-4 text-right md:table-cell">{quantity}</td>
                <td className="hidden p-4 text-right lg:table-cell">{formatCurrency(price ?? 0, currency ?? 'USD')}</td>
                <td className="hidden p-4 text-right lg:table-cell">
                  {formatCurrency((price ?? 0) * (quantity ?? 1), currency ?? 'USD')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end border-b border-neutral-400 pb-7 pt-6">
        <div className="flex w-full flex-col gap-2 lg:w-1/2">
          <div className="flex items-center justify-between text-14 text-gray-600">
            <span>{translate('common.subtotal')}</span>
            <span>{formatCurrency(order.subtotal, order.currency)}</span>
          </div>

          {order.shippingCosts && (
            <div className="flex items-center justify-between text-14 text-gray-600">
              <span>{translate('common.shipping')}</span>
              <span>{formatCurrency(order.shippingCosts, order.currency)}</span>
            </div>
          )}

          {order.taxCosts && (
            <div className="flex items-center justify-between text-14 text-gray-600">
              <span>{translate('common.tax')}</span>
              <span>{formatCurrency(order.taxCosts, order.currency)}</span>
            </div>
          )}

          <div className="flex items-center justify-between font-medium text-gray-700">
            <span>{translate('common.total')}:</span>
            <span>{formatCurrency(order.total, order.currency)}</span>
          </div>
        </div>
      </div>

      <div>
        <h5 className="pb-7 pt-6 text-gray-700">{translate('dashboard.shipping.and.payment')}</h5>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <h6 className="text-14 uppercase text-gray-500">{translate('common.address.shipping')}</h6>
            <p className="mt-2 whitespace-pre-line text-14 text-gray-700">{order.shippingAddress}</p>
          </div>

          <div>
            <h6 className="text-14 uppercase text-gray-500">{translate('common.address.billing')}</h6>
            <p className="mt-2 whitespace-pre-line text-14 text-gray-700">{order.billingAddress}</p>
          </div>

          <div>
            <h6 className="text-14 uppercase text-gray-500">{translate('common.shipping.method')}</h6>
            <p className="mt-2 whitespace-pre-line text-14 text-gray-700">{order.shippingMethod}</p>
          </div>

          <div>
            <h6 className="text-14 uppercase text-gray-500">{translate('common.payment.method')}</h6>
            <p className="mt-2 whitespace-pre-line text-14 text-gray-700">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
