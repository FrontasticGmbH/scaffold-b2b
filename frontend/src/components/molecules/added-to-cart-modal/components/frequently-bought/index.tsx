import React from 'react';
import FrequentlyBoughtSlider from '@/components/molecules/added-to-cart-modal/components/frequently-bought-slider';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { Product } from '@/types/entity/product';

type PropsType = {
  sliderProducts: Product[];
};
const FrequentlyBoughtContainer = ({ sliderProducts }: PropsType) => {
  const { translate } = useTranslation();

  return (
    <div className={'hidden bg-neutral-200 pb-2 pl-6 pt-5 md:block'}>
      <FrequentlyBoughtSlider products={sliderProducts} headline={translate('product.bought.together')} />
    </div>
  );
};

export default FrequentlyBoughtContainer;
