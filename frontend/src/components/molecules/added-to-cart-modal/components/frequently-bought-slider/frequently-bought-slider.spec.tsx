import React from 'react';
import { render, screen } from '@testing-library/react';
import FrequentlyBoughtSlider from '@/components/molecules/added-to-cart-modal/components/frequently-bought-slider';
import { sliderItems } from '@/mocks/productSliderItems';

describe('FrequentlyBoughtSlider', () => {
  it('renders headline when provided', () => {
    render(<FrequentlyBoughtSlider headline="Frequently Bought Together" products={sliderItems} />);

    expect(screen.getByText('Frequently Bought Together')).toBeInTheDocument();
  });

  it('does not render headline when not provided', () => {
    render(<FrequentlyBoughtSlider products={sliderItems} />);

    expect(screen.queryByText('Frequently Bought Together')).toBeNull();
  });

  it('renders product tiles correctly', () => {
    render(<FrequentlyBoughtSlider headline="Frequently Bought Together" products={sliderItems} />);

    expect(screen.getByText('Brake Pad Set, disc brake DELPHI LP20')).toBeInTheDocument();
    expect(screen.getByText('Brake Disk Set, disc brake DELPHI LP20')).toBeInTheDocument();
  });

  it('renders no product tiles when products list is empty', () => {
    render(<FrequentlyBoughtSlider headline="Frequently Bought Together" products={[]} />);

    expect(screen.queryByText('Brake Pad Set, disc brake DELPHI LP20')).toBeNull();
    expect(screen.queryByText('Brake Disk Set, disc brake DELPHI LP20')).toBeNull();
  });
});
