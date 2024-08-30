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

    await act(async () => userEvent.click(screen.getByText('cart.add')));

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

    expect((screen.getByText('cart.add') as HTMLButtonElement).disabled).toBeTruthy();

    await act(async () => userEvent.click(screen.getByText('cart.add')));

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
          quantity: 1,
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
    expect(onQuantityChange).toHaveBeenNthCalledWith(1, 2);
    expect(onQuantityChange).toHaveBeenNthCalledWith(2, 0);
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

    await act(async () => userEvent.click(screen.getAllByText('common.remove')[0]));

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

    expect(screen.queryByText('common.pressure')).toBeNull();
    expect(screen.queryByText('common.weight')).toBeNull();

    expect(screen.queryByText('common.show.all')).toBeNull();
    expect(screen.queryByText('common.show.less')).toBeNull();
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

    expect(screen.getByText('common.show.all')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('common.show.all')));

    expect(screen.getByText('common.pressure -')).toBeDefined();
    expect(screen.getByText('common.weight -')).toBeDefined();

    expect(screen.getByText('common.show.less')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('common.show.less')));

    expect(screen.queryByTestId('common.pressure -')).toBeNull();
    expect(screen.queryByTestId('common.weight -')).toBeNull();

    expect(screen.getByText('common.show.all')).toBeDefined();
  });
});
