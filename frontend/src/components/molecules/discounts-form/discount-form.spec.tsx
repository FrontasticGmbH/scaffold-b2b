import { render, screen, waitFor } from '@test/utils';
import userEvent from '@testing-library/user-event';
import DiscountsForm from './';

describe('DiscountsForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultDiscounts = [
    { discountCodeId: 'disc_1', name: 'Black Friday', code: 'SAVE10', onRemove: jest.fn() },
    { discountCodeId: 'disc_2', name: 'Christmas', code: 'WELCOME5', onRemove: jest.fn() },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the discount form correctly', () => {
    render(<DiscountsForm className="custom-class" discounts={[]} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Apply a discount')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Insert discount code')).toBeInTheDocument();
  });

  it('applies the provided custom className', () => {
    const { container } = render(<DiscountsForm className="custom-container" discounts={[]} />);

    expect(container.querySelector('.custom-container')).toBeInTheDocument();
  });

  it('calls onSubmit with the entered discount code', async () => {
    mockOnSubmit.mockResolvedValue({ success: true });
    render(<DiscountsForm onSubmit={mockOnSubmit} discounts={[]} />);

    const input = screen.getByPlaceholderText('Insert discount code');
    const code = 'SAVE10';

    await userEvent.type(input, code);

    await userEvent.type(input, '{Enter}');

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(code);
    });

    expect(input).toHaveValue('');
  });

  it('displays an error message for invalid discount code', async () => {
    mockOnSubmit.mockResolvedValue({ success: false });
    render(<DiscountsForm onSubmit={mockOnSubmit} customError="Invalid code!" discounts={[]} />);

    const input = screen.getByPlaceholderText('Insert discount code');
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
});
