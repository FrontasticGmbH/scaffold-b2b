import { createContext, Fragment, useCallback, useContext, useState } from 'react';
import { AddToCartOverlayContextShape } from '@/providers/add-to-cart-overlay/types';
import AddedToCartModal from '@/components/molecules/added-to-cart-modal';
import { Product } from '@/types/entity/product';
import useCart from '@/lib/hooks/useCart';
import useProduct from '@/lib/hooks/useProduct';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import { LineItem } from '@shared/types/cart';
import { mapProduct } from '@/utils/mappers/map-product';

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
  const count = addedItem?.count;

  const showModal = useCallback(async (product: Product) => {
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

  return (
    <Fragment>
      {product && addedItem?.lineItemId && relatedProducts.length > 0 && (
        <AddedToCartModal
          item={{ ...product, quantity: count }}
          onClose={hideModal}
          onQuantityChange={handleOnQuantityChange}
          sliderProducts={relatedProducts
            .filter((item) => item.productId !== product.id)
            .map((product) => mapProduct(product))}
        />
      )}
      <AddToCartOverlayContext.Provider value={{ showModal }}>{children}</AddToCartOverlayContext.Provider>
    </Fragment>
  );
};
export default AddToCartOverlayProvider;

export const useAddToCartOverlay = () => useContext(AddToCartOverlayContext);
