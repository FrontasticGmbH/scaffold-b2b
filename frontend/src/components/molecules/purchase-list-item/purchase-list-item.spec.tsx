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
        }}
        onRemove={onRemove}
      />,
    );

    await act(async () => userEvent.click(screen.getAllByText('Remove')[0]));

    expect(onRemove).toHaveBeenCalled();
  });

  test("It doesn't show a `showMore` widget when neither pressure nor weight are present", () => {
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
        }}
      />,
    );

    expect(screen.queryByText('Pressure')).toBeNull();
    expect(screen.queryByText('Weight')).toBeNull();

    expect(screen.queryByText('Show all')).toBeNull();
    expect(screen.queryByText('Show less')).toBeNull();
  });

  test('It shows a `showMore` widget when either pressure or weight are present', async () => {
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
          pressure: '200',
          weight: '20',
        }}
      />,
    );

    expect(screen.getByText('Show all')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('Show all')));

    expect(screen.getByText('Pressure -')).toBeDefined();
    expect(screen.getByText('Weight -')).toBeDefined();

    expect(screen.getByText('Show less')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('Show less')));

    expect(screen.queryByTestId('Pressure -')).toBeNull();
    expect(screen.queryByTestId('Weight -')).toBeNull();

    expect(screen.getByText('Show all')).toBeDefined();
  });
});
