import React from 'react';
import { render, screen } from '@testing-library/react';
import FrequentlyBoughtContainer from '@/components/molecules/added-to-cart-modal/components/frequently-bought/index';

describe('FrequentlyBoughtContainer', () => {
  it('renders headline with correct translation', () => {
    render(<FrequentlyBoughtContainer sliderProducts={[]} />);

    expect(screen.getByText('product.bought.together')).toBeInTheDocument();
  });

  it('renders with the correct class names', () => {
    const { container } = render(<FrequentlyBoughtContainer sliderProducts={[]} />);

    const frequentlyBoughtContainer = container.firstChild;
    expect(frequentlyBoughtContainer).toHaveClass('hidden bg-neutral-200 pb-2 pl-6 pt-5 md:block');
  });
});
