import AddedToCartModal from '@/components/molecules/added-to-cart-modal';
import useCart from '@/lib/hooks/useCart';
import useProduct from '@/lib/hooks/useProduct';
import { AddToCartOverlayContextShape } from '@/providers/add-to-cart-overlay/types';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { Product } from '@/types/entity/product';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { mapProduct } from '@/utils/mappers/map-product';
import { LineItem } from '@shared/types/cart';
import { createContext, Fragment, useCallback, useContext, useMemo, useState } from 'react';

const AddToCartOverlayContext = createContext<AddToCartOverlayContextShape>({} as AddToCartOverlayContextShape);

const AddToCartOverlayProvider = ({ children }: React.PropsWithChildren) => {
  const { selectedBusinessUnit, selectedStore } = useStoreAndBusinessUnits();
  const [product, setProduct] = useState<Product | undefined>();
  const relatedProducts = useProduct({
    categories: product?.categories?.map((category) => category.categoryId) as string[],
    limit: 8,
  });
  const { cart, updateItem } = useCart(selectedBusinessUnit?.key, selectedStore?.key);
  const addedItem = cart?.lineItems?.find((item: LineItem) => {
    return item.variant?.sku === product?.sku;
  });

  const cartProduct = useMemo(() => {
    if (addedItem) {
      return mapLineItem(addedItem, { discountCodes: cart?.discountCodes ?? [] });
    }
    return undefined;
  }, [addedItem, cart?.discountCodes]);

  const showModal = useCallback((product: Product) => {
    setProduct({ ...product });
  }, []);
  const hideModal = useCallback(() => {
    setProduct(undefined);
  }, []);

  const handleOnQuantityChange = async (count: number) => {
    if (addedItem?.lineItemId) {
      await updateItem({ id: addedItem?.lineItemId, count });
    }
  };

  const contextValue = useMemo(() => ({ showModal }), [showModal]);

  return (
    <Fragment>
      {product && cartProduct && addedItem?.lineItemId && relatedProducts.length > 0 && (
        <AddedToCartModal
          item={cartProduct}
          onClose={hideModal}
          onQuantityChange={handleOnQuantityChange}
          sliderProducts={relatedProducts
            .filter((item) => item.productId !== product.id)
            .map((product) => mapProduct(product, { cart }))}
        />
      )}
      <AddToCartOverlayContext.Provider value={contextValue}>{children}</AddToCartOverlayContext.Provider>
    </Fragment>
  );
};
export default AddToCartOverlayProvider;

export const useAddToCartOverlay = () => useContext(AddToCartOverlayContext);
