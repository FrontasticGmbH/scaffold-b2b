import React from 'react';
import { render, screen } from '@test/utils';
import ItemDetails from '@/components/molecules/added-to-cart-modal/components/item-details';
import { sliderItems } from '@/mocks/productSliderItems';

sliderItems[0].images = ['https://cdn.com/sb-assets/brake-pad.png'];
describe('ItemDetails', () => {
  it('renders item details correctly', () => {
    render(<ItemDetails item={sliderItems[0]} />);

    expect(screen.getByText('Brake Pad Set, disc brake DELPHI LP20')).toBeInTheDocument();
    expect(screen.getByText('Castrol')).toBeInTheDocument();
    expect(screen.getByAltText('Brake Pad Set, disc brake DELPHI LP20')).toHaveAttribute(
      'src',
      'https://cdn.com/sb-assets/brake-pad.png',
    );
  });

  it('renders without SKU', () => {
    const itemWithoutSku = { ...sliderItems[0], sku: undefined };
    render(<ItemDetails item={itemWithoutSku} />);

    expect(screen.getByText('Brake Pad Set, disc brake DELPHI LP20')).toBeInTheDocument();
    expect(screen.queryByText('SKU123')).toBeNull();
  });

  it('renders without images', () => {
    const itemWithoutImages = { ...sliderItems[0], images: undefined };
    render(<ItemDetails item={itemWithoutImages} />);

    expect(screen.getByText('Brake Pad Set, disc brake DELPHI LP20')).toBeInTheDocument();
    expect(screen.queryByAltText('Brake Pad Set, disc brake DELPHI LP20')).toBeNull();
  });
});
