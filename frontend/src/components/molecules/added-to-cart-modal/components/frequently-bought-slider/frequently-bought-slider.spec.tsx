import React from 'react';
import { render, screen } from '@testing-library/react';
import FrequentlyBoughtSlider from '@/components/molecules/added-to-cart-modal/components/frequently-bought-slider';
import { Product } from '@/types/entity/product';

describe('FrequentlyBoughtSlider', () => {
  const sliderItems: Product[] = [
    {
      id: '1',
      name: 'Brake Pad Set, disc brake DELPHI LP20',
      sku: 'Castrol',
      price: 9.64,
      priceRange: [9.64, 12.46],
      images: ['https://cdn.com/break-pad.png'],
      currency: 'USD',
    },
    {
      id: '2',
      name: 'Brake Disk Set, disc brake DELPHI LP20',
      sku: 'Castrol',
      price: 9.64,
      discountedPrice: 3.64,
      images: ['https://cdn.com/break-disk.png'],
      currency: 'USD',
    },
  ];

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
