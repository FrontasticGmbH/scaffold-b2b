import React from 'react';
import Slider from '@/components/organisms/slider';
import ProductTile from '@/components/molecules/added-to-cart-modal/components/product-tile';
import Typography from '@/components/atoms/typography';
import { FreqBoughtSliderProps } from '../../types';

const FrequentlyBoughtSlider = ({ headline, products = [] }: FreqBoughtSliderProps) => {
  return (
    <div>
      {headline && <Typography className="mb-4 text-base leading-none">{headline}</Typography>}
      <Slider arrows={false} slidesToShow={4} spaceBetween={{ base: 12 }}>
        {products.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </Slider>
    </div>
  );
};

export default FrequentlyBoughtSlider;
