import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductTile from '@/components/molecules/added-to-cart-modal/components/product-tile';
import { sliderItems } from '@/mocks/productSliderItems';

sliderItems[0].images = ['https://cdn.com/sb-assets/brake-pad.png'];

describe('ProductTile', () => {
  it('renders product details correctly', () => {
    render(<ProductTile product={sliderItems[0]} />);

    expect(screen.getByText('Brake Pad Set, disc brake DELPHI LP20')).toBeInTheDocument();
    expect(screen.getByText('Castrol')).toBeInTheDocument();
    expect(screen.getByText('$9.64')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.com/sb-assets/brake-pad.png');
  });

  it('renders with correct links', () => {
    render(<ProductTile product={{ ...sliderItems[0], url: '/products/1' }} />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/en/products/1');
    });
  });

  it('renders default link when URL is not provided', () => {
    const productWithoutUrl = { ...sliderItems[0], url: undefined };
    render(<ProductTile product={productWithoutUrl} />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '#');
    });
  });
});
