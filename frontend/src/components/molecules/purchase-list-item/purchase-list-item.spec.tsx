import { act, render, screen, waitFor } from '@test/utils';
import userEvent from '@testing-library/user-event';
import PurchaseListItem from '.';

describe('[Component] Purhcase List Item', () => {
  test('It adds to cart correctly when in stock', async () => {
    const onAddToCart = jest.fn(() => new Promise((res) => setTimeout(() => res(true), 100))) as () => Promise<boolean>;

    const tree = render(
      <PurchaseListItem
        item={{
          id: '1',
          name: '',
          image: ' ',
          sku: '',
          url: '',
          quantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [],
        }}
        onAddToCart={onAddToCart}
      />,
    );

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(tree.baseElement.querySelector('.animate-spin')).toBeDefined();
    expect(onAddToCart).toHaveBeenCalled();

    await waitFor(async () => {
      expect(tree.baseElement.querySelector('.animate-spin')).toBeNull();
    });
  });

  test("It doesn't add to cart when out of stock", async () => {
    const onAddToCart = jest.fn(() => new Promise((res) => setTimeout(() => res(true), 100))) as () => Promise<boolean>;

    const tree = render(
      <PurchaseListItem
        item={{
          id: '1',
          name: '',
          image: ' ',
          sku: '',
          url: '',
          quantity: 1,
          price: 100,
          inStock: false,
          currency: 'USD',
          specifications: [],
        }}
        onAddToCart={onAddToCart}
      />,
    );

    expect((screen.getByText('Add to cart') as HTMLButtonElement).disabled).toBeTruthy();

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(tree.baseElement.querySelector('.animate-spin')).toBeNull();
    expect(onAddToCart).not.toHaveBeenCalled();
  });

  test('It can increase/decrease quantity correctly', async () => {
    const onQuantityChange = jest.fn();

    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: '',
          image: ' ',
          sku: '',
          url: '',
          quantity: 2,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [],
        }}
        onQuantityChange={onQuantityChange}
      />,
    );
    await act(async () => userEvent.click(screen.getByText('+')));
    await act(async () => userEvent.click(screen.getByText('-')));

    //Note that quantity is controlled by the `quantity` prop value
    expect(onQuantityChange).toHaveBeenNthCalledWith(1, 3);
    expect(onQuantityChange).toHaveBeenNthCalledWith(2, 1);
  });

  test('It cannot go above the max quantity when increasing the quantity', async () => {
    const onQuantityChange = jest.fn();

    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: '',
          image: ' ',
          sku: '',
          url: '',
          quantity: 1,
          maxQuantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [],
        }}
        onQuantityChange={onQuantityChange}
      />,
    );

    await act(async () => userEvent.click(screen.getByText('+')));

    expect(onQuantityChange).not.toHaveBeenCalled();
  });

  test('It can be removed correctly', async () => {
    const onRemove = jest.fn();

    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: '',
          image: ' ',
          sku: '',
          url: '',
          quantity: 1,
          maxQuantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [
            { label: 'Pressure', value: '200' },
            { label: 'Weight', value: '20' },
          ],
        }}
        onRemove={onRemove}
      />,
    );

    await act(async () => userEvent.click(screen.getAllByText('Remove')[0]));

    expect(onRemove).toHaveBeenCalled();
  });

  test("It doesn't show a `showMore` widget when there are 3 or fewer specifications", () => {
    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: '',
          image: ' ',
          sku: '',
          url: '',
          quantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [
            { label: 'Pressure', value: '200' },
            { label: 'Weight', value: '20' },
          ],
        }}
      />,
    );

    expect(screen.getByText('Pressure:')).toBeInTheDocument();
    expect(screen.getByText('Weight:')).toBeInTheDocument();

    expect(screen.queryByText('Show all')).toBeNull();
    expect(screen.queryByText('Show less')).toBeNull();
  });

  test('It shows a `showMore` widget when there are more than 3 specifications', async () => {
    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: '',
          image: ' ',
          sku: '',
          url: '',
          quantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [
            { label: 'Pressure', value: '200' },
            { label: 'Weight', value: '20' },
            { label: 'Length', value: '10' },
            { label: 'Width', value: '5' },
            { label: 'Height', value: '3' },
          ],
        }}
      />,
    );

    expect(screen.getByText('Show all')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('Show all')));

    expect(screen.getByText('Width:')).toBeDefined();
    expect(screen.getByText('Height:')).toBeDefined();

    expect(screen.getByText('Show less')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('Show less')));

    expect(screen.getByText('Show all')).toBeDefined();
  });

  test('It renders product specifications correctly', () => {
    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: 'Test Product',
          image: 'test-image.jpg',
          sku: 'TEST-001',
          url: '/test-product',
          quantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [
            { label: 'Manufacturer', value: 'Test Brand' },
            { label: 'Part Number', value: 'PN-12345' },
            { label: 'Material', value: 'Steel' },
          ],
        }}
      />,
    );

    expect(screen.getByText('Manufacturer:')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
    expect(screen.getByText('Part Number:')).toBeInTheDocument();
    expect(screen.getByText('PN-12345')).toBeInTheDocument();
    expect(screen.getByText('Material:')).toBeInTheDocument();
    expect(screen.getByText('Steel')).toBeInTheDocument();
  });

  test('It handles empty specifications array gracefully', () => {
    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: 'Test Product',
          image: 'test-image.jpg',
          sku: 'TEST-001',
          url: '/test-product',
          quantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [],
        }}
      />,
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.queryByText('Show all')).toBeNull();
    expect(screen.queryByText('Show less')).toBeNull();
  });

  test('It handles undefined specifications gracefully', () => {
    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: 'Test Product',
          image: 'test-image.jpg',
          sku: 'TEST-001',
          url: '/test-product',
          quantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
        }}
      />,
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.queryByText('Show all')).toBeNull();
    expect(screen.queryByText('Show less')).toBeNull();
  });

  test('It shows exactly 3 specifications without Show More when there are exactly 3', () => {
    render(
      <PurchaseListItem
        item={{
          id: '1',
          name: 'Test Product',
          image: 'test-image.jpg',
          sku: 'TEST-001',
          url: '/test-product',
          quantity: 1,
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [
            { label: 'Manufacturer', value: 'Test Brand' },
            { label: 'Part Number', value: 'PN-12345' },
            { label: 'Material', value: 'Steel' },
          ],
        }}
      />,
    );

    expect(screen.getByText('Manufacturer:')).toBeInTheDocument();
    expect(screen.getByText('Part Number:')).toBeInTheDocument();
    expect(screen.getByText('Material:')).toBeInTheDocument();
    expect(screen.queryByText('Show all')).toBeNull();
    expect(screen.queryByText('Show less')).toBeNull();
  });
});
