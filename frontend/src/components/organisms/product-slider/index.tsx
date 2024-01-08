import React from 'react';
import useResponsiveValue from '@/hooks/useResponsiveValue';
import { ProductSliderProps } from './types';
import Slider from '../slider';
import ProductTile from './components/product-tile';

const ProductSlider = ({ headline, onAddToCart, products = [] }: ProductSliderProps) => {
  const responsiveArrowStyles = useResponsiveValue({
    base: { top: '22%', padding: 0 },
    sm: { top: '25%', padding: 0 },
    md: { top: '25%', padding: 8 },
    lg: { top: '22%', padding: 12 },
    xl: { top: '25%', padding: 12 },
    '2xl': { top: '28%', padding: 12 },
  });

  return (
    <div className="bg-neutral-200 p-4 px-[10px] md:px-4 md:py-5 lg:px-9">
      {headline && (
        <h3 className="px-[6px] pb-4 pt-1 leading-normal text-gray-700 md:px-2 md:pb-5 md:text-18 lg:px-3">
          {headline}
        </h3>
      )}
      <Slider
        slidesToShow={{ base: 2, md: 3, lg: 4 }}
        dots
        arrows
        arrowVariant="overlay"
        arrowStyles={responsiveArrowStyles}
        overlayDarkArrow
        spaceBetween={{ base: 12, md: 16, lg: 24 }}
      >
        {products.map((product) => (
          <ProductTile
            key={product.id}
            product={product}
            onAddToCart={async () => {
              await onAddToCart?.(product.sku ?? '');
            }}
          />
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
