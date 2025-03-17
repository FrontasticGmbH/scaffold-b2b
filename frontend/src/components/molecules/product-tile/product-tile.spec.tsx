import { act, render, screen, waitFor } from '@test/utils';
import userEvent from '@testing-library/user-event';
import ProductTile from '.';

describe('[Component] Product Tile', () => {
  test('It renders price correctly when there is no discount', () => {
    render(<ProductTile item={{ id: '1', name: '', images: [' '], price: 100, currency: 'USD' }} />);

    expect(screen.getByText('$100.00')).toBeDefined();
    expect(screen.getByText('$100.00').classList.contains('line-through')).toBeFalsy();
  });

  test('It renders price & discount correctly when there is a discount', () => {
    render(
      <ProductTile item={{ id: '1', name: '', images: [' '], price: 100, discountedPrice: 90, currency: 'USD' }} />,
    );

    expect(screen.getByText('$100.00')).toBeDefined();
    expect(screen.getByText('$100.00').classList.contains('line-through')).toBeTruthy();

    expect(screen.getByText('$90.00')).toBeDefined();
    expect(screen.getByText('$90.00').classList.contains('line-through')).toBeFalsy();
  });

  test('It adds to cart correctly when in stock', async () => {
    const onAddToCart = jest.fn(() => new Promise((res) => setTimeout(res, 100))) as () => Promise<void>;

    const tree = render(
      <ProductTile
        item={{ id: '1', name: '', images: [' '], price: 100, inStock: true, currency: 'USD' }}
        onAddToCart={onAddToCart}
      />,
    );

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(tree.baseElement.querySelector('.animate-spin')).toBeDefined();
    expect(onAddToCart).toHaveBeenCalledWith(1);

    await waitFor(async () => {
      expect(tree.baseElement.querySelector('.animate-spin')).toBeNull();
    });
  });

  test("It doesn't add to cart when out of stock", async () => {
    const onAddToCart = jest.fn(() => new Promise((res) => setTimeout(res, 100))) as () => Promise<void>;

    const tree = render(
      <ProductTile
        item={{ id: '1', name: '', images: [' '], price: 100, inStock: false, currency: 'USD' }}
        onAddToCart={onAddToCart}
      />,
    );

    expect((screen.getByText('Add to cart') as HTMLButtonElement).disabled).toBeTruthy();

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(tree.baseElement.querySelector('.animate-spin')).toBeNull();
    expect(onAddToCart).not.toHaveBeenCalledWith(1);
  });

  test("It doesn't add to cart when add to cart is disabled", async () => {
    const onAddToCart = jest.fn(() => new Promise((res) => setTimeout(res, 100))) as () => Promise<void>;

    const tree = render(
      <ProductTile
        item={{ id: '1', name: '', images: [' '], price: 100, inStock: true, currency: 'USD' }}
        onAddToCart={onAddToCart}
        addToCartDisabled
      />,
    );

    expect((screen.getByText('Add to cart') as HTMLButtonElement).disabled).toBeTruthy();
    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(tree.baseElement.querySelector('.animate-spin')).toBeNull();
    expect(onAddToCart).not.toHaveBeenCalledWith(1);
  });

  test('It can increase quantity correctly before adding to cart', async () => {
    const onAddToCart = jest.fn();

    render(
      <ProductTile
        item={{ id: '1', name: '', images: [' '], price: 100, inStock: true, currency: 'USD' }}
        onAddToCart={onAddToCart}
      />,
    );

    await act(async () => userEvent.click(screen.getAllByText('+')[0]));
    await act(async () => userEvent.click(screen.getAllByText('+')[0]));
    await act(async () => userEvent.click(screen.getAllByText('+')[0]));
    await act(async () => userEvent.click(screen.getAllByText('-')[0]));

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(onAddToCart).toHaveBeenCalledWith(3);
  });

  test('It cannot go above the max quantity when adding to cart', async () => {
    const onAddToCart = jest.fn();

    render(
      <ProductTile
        item={{ id: '1', name: '', images: [' '], price: 100, inStock: true, maxQuantity: 2, currency: 'USD' }}
        onAddToCart={onAddToCart}
      />,
    );

    await act(async () => userEvent.click(screen.getAllByText('+')[0]));
    await act(async () => userEvent.click(screen.getAllByText('+')[0]));
    await act(async () => userEvent.click(screen.getAllByText('+')[0]));

    await act(async () => userEvent.click(screen.getByText('Add to cart')));

    expect(onAddToCart).toHaveBeenCalledWith(2);
  });

  test('It shows description items correctly for a list-item product', () => {
    /* Max description items to show at a time is 3 */

    render(
      <ProductTile
        item={{
          id: '1',
          name: '',
          images: [' '],
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [
            { label: 'Spec1', value: 'Spec1' },
            { label: 'Spec1', value: 'Spec2' },
            { label: 'Spec1', value: 'Spec3' },
          ],
        }}
        variant="list-item"
      />,
    );

    expect(screen.getByText('Spec1')).toBeDefined();
    expect(screen.getByText('Spec2')).toBeDefined();
    expect(screen.getByText('Spec3')).toBeDefined();

    expect(screen.queryByText('Show all')).toBeNull();
    expect(screen.queryByText('Show less')).toBeNull();
  });

  test('It shows max description items correctly for a list-item product', async () => {
    /* Max description items to show at a time is 3 */

    render(
      <ProductTile
        item={{
          id: '1',
          name: '',
          images: [' '],
          price: 100,
          inStock: true,
          currency: 'USD',
          specifications: [
            { label: 'Spec1', value: 'Spec1' },
            { label: 'Spec1', value: 'Spec2' },
            { label: 'Spec1', value: 'Spec3' },
            { label: 'Spec1', value: 'Spec4' },
            { label: 'Spec1', value: 'Spec5' },
          ],
        }}
        variant="list-item"
      />,
    );

    expect(screen.getByText('Spec1')).toBeDefined();
    expect(screen.getByText('Spec2')).toBeDefined();
    expect(screen.getByText('Spec3')).toBeDefined();
    expect(screen.queryByTestId('Spec4')).toBeNull();
    expect(screen.queryByTestId('Spec5')).toBeNull();

    expect(screen.getByText('Show all')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('Show all')));

    expect(screen.getByText('Spec4')).toBeDefined();
    expect(screen.getByText('Spec5')).toBeDefined();

    expect(screen.getByText('Show less')).toBeDefined();

    await act(async () => userEvent.click(screen.getByText('Show less')));

    expect(screen.getByText('Spec1')).toBeDefined();
    expect(screen.getByText('Spec2')).toBeDefined();
    expect(screen.getByText('Spec3')).toBeDefined();
    expect(screen.queryByTestId('Spec4')).toBeNull();
    expect(screen.queryByTestId('Spec5')).toBeNull();

    expect(screen.getByText('Show all')).toBeDefined();
  });
});
