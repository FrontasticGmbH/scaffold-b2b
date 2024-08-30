import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ActionButtons from '@/components/molecules/added-to-cart-modal/components/action-buttons';

const mockOnClose = jest.fn();

describe('ActionButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders action buttons correctly', () => {
    render(<ActionButtons onClose={mockOnClose} />);

    expect(screen.getByText('cart.continue.shopping')).toBeInTheDocument();
    expect(screen.getByText('cart.go')).toBeInTheDocument();
  });

  it('calls onClose when "Continue Shopping" button is clicked', () => {
    render(<ActionButtons onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('cart.continue.shopping'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('has a link to the cart', () => {
    render(<ActionButtons onClose={mockOnClose} />);

    const cartLink = screen.getByRole('link', { name: 'cart.go' });
    expect(cartLink).toHaveAttribute('href', '/en/cart');
  });
});
