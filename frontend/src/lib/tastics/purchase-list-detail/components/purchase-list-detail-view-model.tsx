import { ImageProps } from '@/components/atoms/Image/types';
import Dashboard from '@/components/pages/dashboard';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import PurchaseListDetailPage from '@/components/pages/dashboard/pages/purchase-list-detail';
import useCustomRouter from '@/hooks/useCustomRouter';
import useAccount from '@/lib/hooks/useAccount';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useCart from '@/lib/hooks/useCart';
import usePurchaseList from '@/lib/hooks/usePurchaseList';
import usePurchaseLists from '@/lib/hooks/usePurchaseLists';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { mapPurchaseList } from '@/utils/mappers/map-purchase-list';

const PurchaseListDetailViewModel = ({ wishlistId, image }: { wishlistId: string; image: ImageProps }) => {
  const router = useCustomRouter();

  const { account } = useAccount();
  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();

  const { addItem: addItemToCart } = useCart(selectedBusinessUnit?.key, selectedStore?.key);

  const { updatePurchaseList, deletePurchaseList } = usePurchaseLists(selectedStore?.key);

  const { purchaseList: wishlist, removeItem, updateItem } = usePurchaseList(wishlistId);

  const { permissions } = useAccountRoles();

  if (!wishlist) return <></>;

  return (
    <Dashboard href={DashboardLinks.shoppingLists} userName={account?.firstName}>
      <PurchaseListDetailPage
        purchaseList={mapPurchaseList(wishlist)}
        image={image}
        permissions={permissions}
        accountId={account?.accountId}
        onAddPurchaseListToCart={async () => {
          if (!wishlist.lineItems?.length) return false;
          const res = await addItemToCart(
            wishlist.lineItems.map((lineItem) => ({
              sku: lineItem.variant?.sku ?? '',
              count: lineItem.count ?? 1,
            })),
          );

          router.push('/cart');

          return res.success;
        }}
        onUpdatePurchaseList={async ({ id, name, description }) => {
          const res = await updatePurchaseList({ wishlistId: id, name, description });

          return !!res?.wishlistId;
        }}
        onDeletePurchaseList={async () => {
          const response = await deletePurchaseList({ wishlistId: wishlist.wishlistId, store: wishlist.store });
          if (response) {
            router.back();
          }
          return !!response;
        }}
        onRemoveItem={async (id) => {
          const res = await removeItem({ wishlistId: wishlist.wishlistId, store: wishlist.store, lineItemId: id });

          return !!res?.wishlistId;
        }}
        onUpdateItem={async (item) => {
          if (!item.sku || !item.id) return false;

          const res = await updateItem({
            wishlistId: wishlist.wishlistId,
            lineItemId: item.id,
            count: item.quantity ?? 1,
          });

          return !!res;
        }}
        onAddItemToCart={async (item) => {
          if (!item.sku) return false;
          const res = await addItemToCart([{ sku: item.sku, count: item.quantity ?? 1 }]);

          return !!res;
        }}
      />
    </Dashboard>
  );
};

export default PurchaseListDetailViewModel;
