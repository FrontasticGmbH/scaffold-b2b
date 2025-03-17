import React from 'react';
import { render, screen, act } from '@test/utils';
import ItemPricing from '@/components/molecules/added-to-cart-modal/components/item-pricing';
import { ItemPricingProps } from '@/components/molecules/added-to-cart-modal/types';
import { sliderItems } from '@/mocks/productSliderItems';
import userEvent from '@testing-library/user-event';

const mockItemPricingProps: ItemPricingProps = {
  item: sliderItems[0],
  quantity: 1,
  onQuantityChange: jest.fn(),
};

describe('ItemPricing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pricing details correctly', () => {
    render(<ItemPricing {...mockItemPricingProps} />);

    expect(screen.getByText('$9.64/ea')).toBeInTheDocument();
    expect(screen.getByText('$9.64/ea')).toBeInTheDocument();
  });

  it('calls onQuantityChange when quantity changes', async () => {
    render(<ItemPricing {...mockItemPricingProps} />);

    await act(async () => userEvent.click(screen.getByText('+')));

    expect(mockItemPricingProps.onQuantityChange).toHaveBeenCalledWith(2);
  });

  it('does not call onQuantityChange when quantity is zero or negative', async () => {
    render(<ItemPricing {...mockItemPricingProps} />);

    await act(async () => userEvent.click(screen.getByText('-')));

    expect(mockItemPricingProps.onQuantityChange).not.toHaveBeenCalled();
  });
});
