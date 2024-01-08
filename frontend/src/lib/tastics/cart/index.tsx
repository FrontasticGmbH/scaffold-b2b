'use client';

import { useEffect } from 'react';
import Cart from '@/components/organisms/cart';
import useCart from '@/lib/hooks/useCart';
import useAccount from '@/lib/hooks/useAccount';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { TasticProps } from '../types';
import { Props } from './types';

const CartTastic = ({}: TasticProps<Props>) => {
  const { account } = useAccount();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { cart, addItem, updateItem, removeItem, requestQuote, updateCart } = useCart(
    selectedBusinessUnit?.key,
    selectedStore?.key,
  );

  const { defaultShippingAddress } = useAccount();

  useEffect(() => {
    if (!cart?.shippingAddress?.addressId && defaultShippingAddress) {
      updateCart({ shipping: defaultShippingAddress });
    }
  }, [cart?.shippingAddress?.addressId, defaultShippingAddress, updateCart]);

  return (
    <Cart
      {...cart}
      account={{ email: account?.email ?? '' }}
      paymentMethods={[]}
      onAdd={async (sku, count) => {
        addItem([{ sku, count }]);
      }}
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
