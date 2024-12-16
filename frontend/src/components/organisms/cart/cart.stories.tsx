import { Meta, StoryFn } from '@storybook/react';
import { cart } from '@/mocks/cart';
import Cart from '.';

export default {
  title: 'Organisms/Cart',
  component: Cart,
} as Meta<typeof Cart>;

const Template: StoryFn<typeof Cart> = () => (
  <Cart
    {...cart}
    account={{ email: 'madilyn@commercetools.com' }}
    onRemove={async () => {}}
    onAdd={async () => {}}
    onUpdateQuantity={async () => {}}
    onAddToNewWishlist={async () => Promise.resolve(null)}
    paymentMethods={[]}
    discountCodes={[]}
  />
);

export const Primary = Template.bind({});
Primary.args = {};
