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

    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('USD 10.00')).toBeInTheDocument();

    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('USD 15.00')).toBeInTheDocument();

    expect(screen.getByText('Discounts')).toBeInTheDocument();
    expect(screen.getByText('-USD 5.00')).toBeInTheDocument();

    expect(screen.getByText('Total', { exact: true })).toBeInTheDocument();
    expect(screen.getByText('USD 110.00')).toBeInTheDocument();
  });

  it('Renders the cost with value of 0 correctly', () => {
    render(<Costs {...defaultProps} shipping={undefined} tax={undefined} discount={0} />);

    expect(screen.queryByText('Shipping')).toBeInTheDocument();
    expect(screen.queryByText('Tax')).toBeInTheDocument();
    expect(screen.queryAllByText('Calculated later').length).toBe(2);

    expect(screen.queryByText('Discounts')).not.toBeInTheDocument();

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
