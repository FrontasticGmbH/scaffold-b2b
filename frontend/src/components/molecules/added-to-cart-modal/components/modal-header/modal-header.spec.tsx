import React from 'react';
import { render, screen } from '@test/utils';
import ModalHeader from '@/components/molecules/added-to-cart-modal/components/modal-header';

describe('ModalHeader', () => {
  it('renders translated text correctly', () => {
    render(<ModalHeader />);

    expect(screen.getByText('Item added to cart')).toBeInTheDocument();
  });

  it('renders with correct class names', () => {
    const { container } = render(<ModalHeader />);

    const typographyElement = container.firstChild;
    expect(typographyElement).toHaveClass('mb-6 text-lg text-gray-700 md:mb-8 md:text-xl');
  });
});
