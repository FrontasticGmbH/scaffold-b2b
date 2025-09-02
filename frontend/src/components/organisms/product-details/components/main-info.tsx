import { useState } from 'react';
import useFormat from '@/hooks/useFormat';
import { useAddToCartOverlay } from '@/providers/add-to-cart-overlay';
import { classnames } from '@/utils/classnames/classnames';
import { useTranslations } from 'use-intl';
import { PDPMainInfoProps } from '../types';
import ColoredVariants from './color-variants';
import SpecsVariants from './specs-variants';
import CartCTA from './cart-cta';
import ShoppingListCTA from './shopping-list-cta';
import Shipping from './shipping';

const MainInfo = ({
  product,
  className,
  currentColor,
  currentSpecs,
  shippingMethods,
  addToCart,
  getWishlists,
  canAddToOwnWishlist,
  canAddToOthersWishlist,
  addToWishlists,
  removeFromWishlists,
  onChangeVariant,
  addToNewWishlist,
  addToCartDisabled,
}: PDPMainInfoProps) => {
  const [quantity, setQuantity] = useState(1);

  const { formatCurrency } = useFormat();
  const { showModal } = useAddToCartOverlay();
  const translate = useTranslations();

  const handleOnAddToCart = async (count: number) => {
    await addToCart(count);
    showModal(product);
  };

  const handleQuantityChange = (count: number) => {
    setQuantity(count);
  };

  return (
    <div className={className}>
      <div className="grid gap-6">
        {product.discountedPrice ? (
          <div className="flex items-center gap-2">
            <p className="text-18 font-bold leading-loose text-red-500 md:text-20 lg:text-24">
              {formatCurrency(product.discountedPrice, product.currency)}
            </p>
            <h2 className="text-12 leading-loose text-gray-600 line-through md:text-14">
              {formatCurrency(product.price, product.currency)}
            </h2>
          </div>
        ) : (
          <h2
            className={classnames('text-18 font-bold leading-loose md:text-20 lg:text-24', {
              'text-red-500': !product.price,
              'text-gray-700': !!product.price,
            })}
          >
            {!product.price ? translate('common.not-available') : formatCurrency(product.price, product.currency)}
          </h2>
        )}

        {currentColor && product.colors && (
          <ColoredVariants
            currentColor={currentColor}
            colors={product.colors}
            onChangeColor={(value) => onChangeVariant('color', value)}
          />
        )}

        {currentSpecs && product.specs && (
          <SpecsVariants
            currentSpecs={currentSpecs}
            specs={product.specs}
            onChangeSpecs={(value) => onChangeVariant('model', value)}
          />
        )}
        {!product.inStock && product.price && (
          <p className="text-18 leading-loose text-red-500 md:text-16 lg:text-18">{translate('common.out-of-stock')}</p>
        )}
        <CartCTA
          product={product}
          countChange={handleQuantityChange}
          addToCart={handleOnAddToCart}
          addToCartDisabled={addToCartDisabled || product.maxQuantity === 0 || !product.price}
        />

        <ShoppingListCTA
          getWishlists={getWishlists}
          removeFromWishlists={removeFromWishlists}
          addToNewWishlist={(list) => addToNewWishlist(list, quantity)}
          addToWishlists={(wishlistIds) => addToWishlists(wishlistIds, quantity)}
          canAddToOwnWishlist={canAddToOwnWishlist}
          canAddToOthersWishlist={canAddToOthersWishlist}
          addToWishlistDisabled={!product.price || product.maxQuantity === 0}
        />

        <Shipping shippingMethods={shippingMethods} currency={product.currency} />
      </div>
    </div>
  );
};

export default MainInfo;
