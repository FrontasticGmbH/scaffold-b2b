import Gallery from '../gallery';
import AdditionalInfo from './components/additional-info';
import Header from './components/header';
import MainInfo from './components/main-info';
import { ProductDetailsProps } from './types';

const ProductDetails = ({
  product,
  currentColor,
  currentSpecs,
  additionalInfo,
  shippingMethods,
  addToCart,
  getWishlists,
  addToWishlists,
  onChangeVariant,
  addToNewWishlist,
}: ProductDetailsProps) => {
  return (
    <div className="px-4 md:px-6 lg:px-12">
      <Header className="mb-2 md:mb-5 lg:mb-9" product={product} />

      <div className="md:grid md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
        <Gallery className="col-span-1 lg:col-span-9" images={product.images ?? []} />

        <MainInfo
          className="md:pl-5 lg:col-span-3 lg:pl-0"
          product={product}
          currentColor={currentColor}
          currentSpecs={currentSpecs}
          addToCart={addToCart}
          getWishlists={getWishlists}
          addToWishlists={addToWishlists}
          onChangeVariant={onChangeVariant}
          shippingMethods={shippingMethods}
          addToNewWishlist={addToNewWishlist}
        />
      </div>

      <AdditionalInfo className="mt-8 md:mt-12 lg:mt-14" additionalInfo={additionalInfo} />
    </div>
  );
};

export default ProductDetails;
