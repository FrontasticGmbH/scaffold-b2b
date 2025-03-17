import { cleanup, render, screen } from '@test/utils';
import StockIndicator from '.';

describe('[Component] Stock Indicator', () => {
  test('It shows correct message when in stock', () => {
    render(<StockIndicator inStock />);

    expect(screen.getByText('In stock')).toBeDefined();
  });

  test('It shows default out of stock message when `restockableInDays` is not provided', () => {
    render(<StockIndicator inStock={false} />);

    expect(screen.getByText('Out of stock')).toBeDefined();
  });

  test('It shows `restockableInDays` in days correctly', () => {
    render(<StockIndicator restockableInDays={1} />);

    expect(screen.getByText('Available in 1 day')).toBeDefined();

    cleanup();

    render(<StockIndicator restockableInDays={2} />);

    expect(screen.getByText('Available in 2 days')).toBeDefined();
  });

  test('It shows `restockableInDays` in weeks correctly', () => {
    render(<StockIndicator restockableInDays={7} />);

    expect(screen.getByText('Available in 1 week')).toBeDefined();

    cleanup();

    render(<StockIndicator restockableInDays={14} />);

    expect(screen.getByText('Available in 2 weeks')).toBeDefined();
  });

  test('It shows `restockableInDays` in months correctly', () => {
    render(<StockIndicator restockableInDays={30} />);

    expect(screen.getByText('Available in 1 month')).toBeDefined();

    cleanup();

    render(<StockIndicator restockableInDays={60} />);

    expect(screen.getByText('Available in 2 months')).toBeDefined();
  });
});
