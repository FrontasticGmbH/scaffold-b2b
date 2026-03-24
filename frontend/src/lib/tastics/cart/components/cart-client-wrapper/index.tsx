'use client';

import { useCallback } from 'react';
import Cart from '@/components/organisms/cart';
import useCart from '@/lib/hooks/useCart';
import useAccount from '@/lib/hooks/useAccount';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import { TasticProps } from '@/lib/tastics/types';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { PurchaseList } from '@/types/entity/purchase-list';
import { Props } from '../../types';

const CartClientWrapper = ({}: TasticProps<Props>) => {
  const { account } = useAccount();

  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();
  const { createPurchaseList, addToWishlists } = usePurchaseLists(selectedStore?.key);

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const { cart, isLoading, addItem, updateItem, removeItem, clearCart, removeDiscount, redeemDiscount } = useCart(
    selectedBusinessUnit?.key,
    selectedStore?.key,
  );

  const invalidAddressesRequirements =
    !selectedBusinessUnit?.addresses.length && !permissions.UpdateBusinessUnitDetails;

  const addToNewWishlist = useCallback(
    async (
      { name, description, store }: Pick<PurchaseList, 'name' | 'description' | 'store'>,
      sku?: string,
      qty?: number,
    ) => {
      const result = await createPurchaseList({ name, description, store });
      addToWishlists({
        wishlistIds: [result?.wishlistId ?? ''],
        sku: sku ?? '',
        count: qty ?? 1,
      });
      return result;
    },
    [addToWishlists, createPurchaseList],
  );

  return (
    <Cart
      {...cart}
      key={`${selectedBusinessUnit?.key}-${selectedStore?.key}`}
      loading={isLoading}
      lineItems={(cart?.lineItems ?? []).map(mapLineItem)}
      viewCartDisabled={!permissions.ViewMyCarts}
      checkoutDisabled={!permissions.CreateMyOrdersFromMyCarts || invalidAddressesRequirements}
      quoteRequestDisabled={!permissions.CreateMyQuoteRequestsFromMyCarts || invalidAddressesRequirements}
      invalidAddressesRequirements={invalidAddressesRequirements}
      account={{ email: account?.email ?? '' }}
      paymentMethods={[]}
      onDiscountRedeem={async (code: string) => {
        const res = await redeemDiscount(code);
        return !!res.cartId;
      }}
      discountCodes={(cart?.discountCodes ?? []).map(({ discountCodeId, name, code }) => ({
        discountCodeId: discountCodeId ?? '',
        name: name ?? '',
        code: code ?? '',
        onRemove: async () => {
          const res = await removeDiscount(discountCodeId ?? '');
          return !!res.cartId;
        },
      }))}
      onClear={async () => {
        await clearCart();
      }}
      onAdd={async (sku, count) => {
        await addItem([{ sku, count }]);
      }}
      onUpdateQuantity={async (id, count) => {
        await updateItem({ id, count });
      }}
      onRemove={async (id) => {
        await removeItem(id);
      }}
      onAddToNewWishlist={addToNewWishlist}
    />
  );
};

export default CartClientWrapper;
