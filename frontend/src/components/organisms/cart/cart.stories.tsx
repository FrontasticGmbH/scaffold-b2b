import { Meta, StoryFn } from '@storybook/react';
import {
  cart as baseCart,
  cartWithLineItemDiscounts,
  cartWithPerCountDiscountsAndGift,
  discountCodes20OFF,
  transactionWith20OFF,
} from '@/mocks/cart';
import Cart from '.';

export default {
  title: 'Organisms/Cart',
  component: Cart,
} as Meta<typeof Cart>;

const CommonProps = {
  account: { email: 'madilyn@commercetools.com' },
  onRemove: async () => {},
  onAdd: async () => {},
  onUpdateQuantity: async () => {},
  onAddToNewWishlist: async () => Promise.resolve(null),
  paymentMethods: [] as never[],
};

export const Primary: StoryFn<typeof Cart> = () => <Cart {...baseCart} {...CommonProps} discountCodes={[]} />;

export const WithLineItemDiscounts: StoryFn<typeof Cart> = () => (
  <Cart {...cartWithLineItemDiscounts} {...CommonProps} discountCodes={[]} />
);

export const WithPerCountDiscountsAndGift: StoryFn<typeof Cart> = () => (
  <Cart {...cartWithPerCountDiscountsAndGift} {...CommonProps} discountCodes={[]} />
);

export const WithCartDiscountCode: StoryFn<typeof Cart> = () => (
  <Cart {...baseCart} {...CommonProps} discountCodes={discountCodes20OFF as any} transaction={transactionWith20OFF} />
);
