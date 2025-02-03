import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiscountsForm from './';

describe('DiscountsForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultDiscounts = [
    { name: 'Black Friday', code: 'SAVE10', onRemove: jest.fn() },
    { name: 'Christmas', code: 'WELCOME5', onRemove: jest.fn() },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the discount form correctly', () => {
    render(<DiscountsForm className="custom-class" discounts={[]} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('cart.discount.apply')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('cart.discount.enter')).toBeInTheDocument();
  });

  it('applies the provided custom className', () => {
    const { container } = render(<DiscountsForm className="custom-container" discounts={[]} />);

    expect(container.querySelector('.custom-container')).toBeInTheDocument();
  });

  it('calls onSubmit with the entered discount code', async () => {
    mockOnSubmit.mockResolvedValue(true);
    render(<DiscountsForm onSubmit={mockOnSubmit} discounts={[]} />);

    const input = screen.getByPlaceholderText('cart.discount.enter');
    const code = 'SAVE10';

    await userEvent.type(input, code);

    await userEvent.type(input, '{Enter}');

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(code);
    });

    expect(input).toHaveValue('');
  });

  it('displays an error message for invalid discount code', async () => {
    mockOnSubmit.mockResolvedValue(false);
    render(<DiscountsForm onSubmit={mockOnSubmit} customError="Invalid code!" discounts={[]} />);

    const input = screen.getByPlaceholderText('cart.discount.enter');
    const code = 'INVALID';

    await userEvent.type(input, code);

    await userEvent.type(input, '{Enter}');

    await waitFor(() => {
      expect(screen.getByText('Invalid code!')).toBeInTheDocument();
      expect(input).toHaveClass('text-red-500');
    });
  });

  it('renders the list of discounts', async () => {
    render(<DiscountsForm discounts={defaultDiscounts} />);

    expect(screen.getByText('SAVE10')).toBeInTheDocument();
    expect(screen.getByText('WELCOME5')).toBeInTheDocument();

    const removeButtons = screen.getAllByTestId('remove-discount-code');
    expect(removeButtons).toHaveLength(2);

    await userEvent.click(removeButtons[0]);
    expect(defaultDiscounts[0].onRemove).toHaveBeenCalledTimes(1);
  });

  it('clears the input when XMarkIcon is clicked', async () => {
    render(<DiscountsForm discounts={[]} onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('cart.discount.enter');
    const code = 'SAVE10';

    await userEvent.type(input, code);

    expect(input).toHaveValue(code);

    await userEvent.keyboard('{Enter}');

    const clearIcon = screen.getByTestId('clear-input');
    await userEvent.click(clearIcon);

    expect(input).toHaveValue('');
  });
});
