import { cleanup, render, screen } from '@test/utils';
import StockIndicator from '.';

describe('[Component] Stock Indicator', () => {
  test('It shows correct message when in stock', () => {
    render(<StockIndicator inStock />);

    expect(screen.getByText('common.in.stock')).toBeDefined();
  });

  test('It shows default out of stock message when `restockableInDays` is not provided', () => {
    render(<StockIndicator inStock={false} />);

    expect(screen.getByText('common.out.of.stock')).toBeDefined();
  });

  test('It shows `restockableInDays` in days correctly', () => {
    render(<StockIndicator restockableInDays={1} />);

    expect(screen.getByText('common.available.in 1 common.day')).toBeDefined();

    cleanup();

    render(<StockIndicator restockableInDays={2} />);

    expect(screen.getByText('common.available.in 2 common.days')).toBeDefined();
  });

  test('It shows `restockableInDays` in weeks correctly', () => {
    render(<StockIndicator restockableInDays={7} />);

    expect(screen.getByText('common.available.in 1 common.week')).toBeDefined();

    cleanup();

    render(<StockIndicator restockableInDays={14} />);

    expect(screen.getByText('common.available.in 2 common.weeks')).toBeDefined();
  });

  test('It shows `restockableInDays` in months correctly', () => {
    render(<StockIndicator restockableInDays={30} />);

    expect(screen.getByText('common.available.in 1 common.month')).toBeDefined();

    cleanup();

    render(<StockIndicator restockableInDays={60} />);

    expect(screen.getByText('common.available.in 2 common.months')).toBeDefined();
  });
});
