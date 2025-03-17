import { render, screen } from '@test/utils';
import { CostsProps } from '@/components/molecules/costs/types';
import Costs from './';

jest.mock('@/hooks/useFormat', () => ({
  __esModule: true,
  default: () => ({
    formatCurrency: (value: number, currency: string) => `${currency} ${value.toFixed(2)}`,
  }),
}));

describe('Costs Component', () => {
  const defaultProps = {
    shipping: 10,
    subtotal: 100,
    total: 110,
    discount: 5,
    tax: 15,
    currency: 'USD',
    loading: false,
    classNames: {},
  } as CostsProps;

  it('renders all cost items and total correctly', () => {
    render(<Costs {...defaultProps} />);

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('USD 100.00')).toBeInTheDocument();

    expect(screen.getByText('Est- Shipping')).toBeInTheDocument();
    expect(screen.getByText('USD 10.00')).toBeInTheDocument();

    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('USD 15.00')).toBeInTheDocument();

    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText('USD -5.00')).toBeInTheDocument();

    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('USD 110.00')).toBeInTheDocument();
  });

  it('does not render costs with a value of 0', () => {
    render(<Costs {...defaultProps} shipping={0} tax={0} discount={0} />);

    expect(screen.queryByText('Est- Shipping')).not.toBeInTheDocument();
    expect(screen.queryByText('Tax')).not.toBeInTheDocument();
    expect(screen.queryByText('Discount')).not.toBeInTheDocument();

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('USD 100.00')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    const props = { ...defaultProps, subtotal: 1234.567, total: 5678.901 };
    render(<Costs {...props} />);

    expect(screen.getByText('USD 1234.57')).toBeInTheDocument();
    expect(screen.getByText('USD 5678.90')).toBeInTheDocument();
  });

  it('uses "cart.shipping" translation when shipping is not estimated', () => {
    render(<Costs {...defaultProps} isShippingEstimated={false} />);

    expect(screen.getByText('Shipping')).toBeInTheDocument();
  });

  it('renders skeleton loader when loading is true', () => {
    render(<Costs {...defaultProps} loading={true} />);

    const skeletons = screen.getAllByTestId('skeleton'); // Assuming `asSkeleton` renders a data-testid="skeleton"

    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('applies custom classNames', () => {
    const customClasses = {
      container: 'custom-container',
      totalAmount: 'custom-total',
      subCostsContainer: 'custom-subcosts-container',
      subCosts: 'custom-subcosts',
    };

    const { container } = render(<Costs {...defaultProps} classNames={customClasses} />);

    const containerElement = container.querySelector('.custom-container');
    const totalAmountElement = container.querySelector('.custom-total');
    const subCostsContainerElement = container.querySelector('.custom-subcosts-container');
    const subCostsElements = container.querySelectorAll('.custom-subcosts');

    // Assertions
    expect(containerElement).toBeInTheDocument();
    expect(totalAmountElement).toBeInTheDocument();
    expect(subCostsContainerElement).toBeInTheDocument();
    expect(subCostsElements.length).toBeGreaterThan(0);
  });
});
