import React from 'react';
import { render, screen } from '@testing-library/react';
import AddedToCartModal from '@/components/molecules/added-to-cart-modal/index';
import { Product } from '@/types/entity/product';

const mockOnClose = jest.fn();
const mockOnQuantityChange = jest.fn();

describe('AddedToCartModal', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when item is provided', () => {
    render(
      <AddedToCartModal
        item={sliderItems[0]}
        onClose={mockOnClose}
        onQuantityChange={mockOnQuantityChange}
        sliderProducts={sliderItems}
      />,
    );

    expect(screen.getByText('product.bought.together')).toBeInTheDocument();
  });
});
