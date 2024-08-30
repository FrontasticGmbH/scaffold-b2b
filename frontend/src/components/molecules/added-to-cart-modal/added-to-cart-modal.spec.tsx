import React from 'react';
import { render, screen } from '@testing-library/react';
import { sliderItems } from '@/mocks/productSliderItems';
import AddedToCartModal from '@/components/molecules/added-to-cart-modal/index';

const mockOnClose = jest.fn();
const mockOnQuantityChange = jest.fn();

describe('AddedToCartModal', () => {
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
