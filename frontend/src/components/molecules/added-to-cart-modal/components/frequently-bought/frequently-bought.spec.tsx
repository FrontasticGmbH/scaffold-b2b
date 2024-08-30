import React from 'react';
import { render, screen } from '@testing-library/react';
import { sliderItems } from '@/mocks/productSliderItems';
import FrequentlyBoughtContainer from '@/components/molecules/added-to-cart-modal/components/frequently-bought/index';

describe('FrequentlyBoughtContainer', () => {
  it('renders headline with correct translation', () => {
    render(<FrequentlyBoughtContainer sliderProducts={sliderItems} />);

    expect(screen.getByText('product.bought.together')).toBeInTheDocument();
  });

  it('renders with the correct class names', () => {
    const { container } = render(<FrequentlyBoughtContainer sliderProducts={sliderItems} />);

    const frequentlyBoughtContainer = container.firstChild;
    expect(frequentlyBoughtContainer).toHaveClass('hidden bg-neutral-200 pb-2 pl-6 pt-5 md:block');
  });
});
