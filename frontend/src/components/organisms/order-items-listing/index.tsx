import React, { FC, useMemo, useState } from 'react';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import Typography from '@/components/atoms/typography';
import Accordion from '@/components/molecules/accordion';
import ClosedButton from './components/closed-button';
import OrderItem from './components/order-item';
import OrderItemsList from './components/order-items-list';
import { OrderItemsListingProps } from './types';

const OrderItemsListing: FC<OrderItemsListingProps> = ({ className, lineItems }) => {
  const translate = useTranslations();

  const [open, setOpen] = useState(false);

  const containerClassName = classnames('grid w-full grid-cols-1', className);
  const accordionClassNames = classnames('hidden lg:block lg:pt-0', className);
  const listClassNames = classnames('block lg:hidden', className);

  const hiddenItemsCount = useMemo(() => (lineItems?.length ?? 0) - 3, [lineItems?.length]);

  return (
    <>
      {lineItems.length === 1 ? (
        <div className={containerClassName}>
          <div className="border-b pb-16">
            <Typography fontSize={16} className="text-secondary">
              {translate('orders.your-order')}
            </Typography>
          </div>
          <OrderItem lineItem={lineItems[0]} />
        </div>
      ) : (
        <Accordion className={accordionClassNames}>
          <ClosedButton
            hiddenItemsCount={hiddenItemsCount}
            lineItems={lineItems}
            open={open}
            onClick={() => setOpen(!open)}
          />
          <OrderItemsList lineItems={lineItems} />
        </Accordion>
      )}

      <OrderItemsList className={listClassNames} lineItems={lineItems} />
    </>
  );
};

export default OrderItemsListing;
