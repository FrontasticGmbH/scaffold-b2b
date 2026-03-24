'use client';

import ProductDetails from '@/components/organisms/product-details';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import { ProductDetailsMapperProps } from '../types';
import usePDPWishlists from '../hooks/usePDPWishlists';
import usePDPCart from '../hooks/usePDPCart';
import usePDPProduct from '../hooks/usePDPProduct';

const ProductDetailsMapper = ({ product }: ProductDetailsMapperProps) => {
  const { currentColor, currentSpecs, mappedProduct, onChangeVariant } = usePDPProduct(product);

  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const { permissions } = useAccountRoles(selectedBusinessUnit?.key);

  const { addToWishlists, removeFromWishlists, addToNewWishlist, getWishlists } = usePDPWishlists(mappedProduct);

  const { addToCart, shippingMethods } = usePDPCart(mappedProduct);

  return (
    <ProductDetails
      product={mappedProduct}
      currentColor={currentColor}
      currentSpecs={currentSpecs}
      shippingMethods={shippingMethods}
      addToCartDisabled={!permissions.UpdateMyCarts}
      addToCart={addToCart}
      getWishlists={getWishlists}
      addToWishlists={addToWishlists}
      onChangeVariant={onChangeVariant}
      addToNewWishlist={addToNewWishlist}
      removeFromWishlists={removeFromWishlists}
    />
  );
};

export default ProductDetailsMapper;
