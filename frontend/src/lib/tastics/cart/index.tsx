'use client';

import { useEffect } from 'react';
import Cart from '@/components/organisms/cart';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import useStores from '@/lib/hooks/useStores';
import useCart from '@/lib/hooks/useCart';
import useAccount from '@/lib/hooks/useAccount';
import { TasticProps } from '../types';
import { Props } from './types';

const CartTastic = ({ data }: TasticProps<Props>) => {
  const { defaultBusinessUnit } = useBusinessUnits();

  const { account } = useAccount();

  const { defaultStore } = useStores();

  const { cart, updateItem, removeItem, requestQuote, updateCart } = useCart(
    defaultBusinessUnit?.key,
    defaultStore?.key,
  );

  const { defaultShippingAddress } = useAccount();

  useEffect(() => {
    if (!cart?.shippingAddress?.addressId && defaultShippingAddress) {
      updateCart({ shipping: defaultShippingAddress });
    }
  }, [cart?.shippingAddress?.addressId, defaultShippingAddress, updateCart]);

  if (!cart) return <></>;

  return (
    <Cart
      account={{ email: account?.email ?? '' }}
      paymentMethods={data.paymentMethods}
      {...cart}
      onUpdateQuantity={async (id, count) => {
        updateItem({ id, count });
      }}
      onRemove={async (id) => {
        removeItem(id);
      }}
      onRequestQuote={async ({ buyerComment }) => {
        const quote = await requestQuote({ buyerComment: buyerComment ?? '' });

        return quote.quoteRequestId ? { id: quote.quoteRequestId } : {};
      }}
    />
  );
};

export default CartTastic;
