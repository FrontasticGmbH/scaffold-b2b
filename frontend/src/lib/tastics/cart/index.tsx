'use client';

import { useCallback, useEffect, useRef } from 'react';
import Cart from '@/components/organisms/cart';
import useCart from '@/lib/hooks/useCart';
import useAccount from '@/lib/hooks/useAccount';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { Wishlist as SharedWishlist } from '@shared/types/wishlist';
import { TasticProps } from '../types';
import { Props } from './types';

const CartTastic = ({}: TasticProps<Props>) => {
  const { account } = useAccount();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();
  const { createPurchaseList, addToWishlists } = usePurchaseLists(selectedStore?.key);

  const { cart, addItem, updateItem, removeItem, requestQuote, updateCart, clearCart, isQuotationCart } = useCart(
    selectedBusinessUnit?.key,
    selectedStore?.key,
  );

  const defaultShippingAddress =
    selectedBusinessUnit?.addresses.find((address) => address.isDefaultShipping) ?? selectedBusinessUnit?.addresses[0];

  const shippingAddressUpdated = useRef(false);

  useEffect(() => {
    if (defaultShippingAddress && !shippingAddressUpdated.current) {
      shippingAddressUpdated.current = true;
      updateCart({ shipping: defaultShippingAddress });
    }
  }, [cart?.shippingAddress?.addressId, defaultShippingAddress, updateCart]);

  const addToNewWishlist = useCallback(
    async (wishlist: Pick<SharedWishlist, 'name' | 'description' | 'store'>, sku?: string, qty?: number) => {
      const result = await createPurchaseList(wishlist);
      addToWishlists({
        wishlistIds: [result?.wishlistId ?? ''],
        sku: sku ?? '',
        count: qty ?? 1,
      });
      removeItem(cart?.lineItems?.find((item) => item.variant?.sku === sku)?.lineItemId ?? '');
    },
    [addToWishlists, cart?.lineItems, createPurchaseList, removeItem],
  );

  return (
    <Cart
      onAddToNewWishlist={addToNewWishlist}
      {...cart}
      account={{ email: account?.email ?? '' }}
      paymentMethods={[]}
      onClear={async () => {
        await clearCart();
      }}
      isQuotationCart={isQuotationCart}
      onAdd={async (sku, count) => {
        await addItem([{ sku, count }]);
      }}
      onUpdateQuantity={async (id, count) => {
        await updateItem({ id, count });
      }}
      onRemove={async (id) => {
        await removeItem(id);
      }}
      onRequestQuote={async ({ buyerComment }) => {
        const quote = await requestQuote({ buyerComment: buyerComment ?? '' });

        return quote.quoteRequestId ? { id: quote.quoteRequestId } : {};
      }}
    />
  );
};

export default CartTastic;
