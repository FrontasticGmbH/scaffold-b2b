import InfoBanner from '@/components/molecules/info-banner';
import { useTranslations } from 'use-intl';
import Gallery from '../gallery';
import AdditionalInfo from './components/additional-info';
import Header from './components/header';
import { ProductDetailsProps } from './types';
import MainInfo from './components/main-info';

const ProductDetails = ({
  product,
  currentColor,
  currentSpecs,
  shippingMethods,
  addToCart,
  getWishlists,
  addToWishlists,
  removeFromWishlists,
  onChangeVariant,
  addToNewWishlist,
  addToCartDisabled = false,
}: ProductDetailsProps) => {
  const translate = useTranslations();

  return (
    <div className="mb-16 px-4 md:px-6 lg:px-12">
      {addToCartDisabled && (
        <InfoBanner className="mt-3">
          <b>{translate('common.view-only')}</b> {translate('cart.view-only-desc')}
        </InfoBanner>
      )}

      <Header className="mb-2 md:mb-5 lg:mb-9" product={product} />

      <div className="md:grid md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
        <Gallery className="col-span-1 lg:col-span-9" images={product.images ?? []} />

        <MainInfo
          className="md:pl-5 lg:col-span-3 lg:pl-0"
          product={product}
          currentColor={currentColor}
          currentSpecs={currentSpecs}
          shippingMethods={shippingMethods}
          addToCartDisabled={addToCartDisabled}
          addToCart={addToCart}
          getWishlists={getWishlists}
          removeFromWishlists={removeFromWishlists}
          addToWishlists={addToWishlists}
          onChangeVariant={onChangeVariant}
          addToNewWishlist={addToNewWishlist}
        />
      </div>

      <AdditionalInfo
        className="mt-8 md:mt-12 lg:mt-14"
        description={product.description}
        specifications={product.specifications}
      />
    </div>
  );
};

export default ProductDetails;
