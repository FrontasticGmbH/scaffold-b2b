import { useState } from 'react';
import Typography from '@/components/atoms/typography';
import useFormat from '@/hooks/useFormat';
import { useAddToCartOverlay } from '@/providers/add-to-cart-overlay';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
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
  addToWishlists,
  removeFromWishlists,
  onChangeVariant,
  addToNewWishlist,
  addToCartDisabled,
}: PDPMainInfoProps) => {
  const [quantity, setQuantity] = useState(1);

  const { formatCurrency } = useFormat();
  const { showModal } = useAddToCartOverlay();
  const { translate } = useTranslation();

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
            <Typography
              className="text-red-500 md:text-20 lg:text-24"
              fontSize={18}
              lineHeight="loose"
              fontWeight="bold"
            >
              {formatCurrency(product.discountedPrice, product.currency)}
            </Typography>
            <Typography as="h2" className="text-gray-600 line-through md:text-14" fontSize={12} lineHeight="loose">
              {formatCurrency(product.price, product.currency)}
            </Typography>
          </div>
        ) : (
          <Typography
            as="h2"
            className="text-gray-700 md:text-20 lg:text-24"
            fontSize={18}
            lineHeight="loose"
            fontWeight="bold"
          >
            {formatCurrency(product.price, product.currency)}
          </Typography>
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
        {(!product.inStock || !product.price) && (
          <Typography fontSize={18} lineHeight="loose" className="text-red-500 md:text-16 lg:text-18">
            {translate('common.out.of.stock')}
          </Typography>
        )}
        <CartCTA
          product={product}
          countChange={handleQuantityChange}
          addToCart={handleOnAddToCart}
          addToCartDisabled={addToCartDisabled || product.maxQuantity === 0}
        />

        <ShoppingListCTA
          getWishlists={getWishlists}
          removeFromWishlists={removeFromWishlists}
          addToNewWishlist={(list) => addToNewWishlist(list, quantity)}
          addToWishlists={(wishlistIds) => addToWishlists(wishlistIds, quantity)}
        />

        <Shipping shippingMethods={shippingMethods} currency={product.currency} />
      </div>
    </div>
  );
};

export default MainInfo;
