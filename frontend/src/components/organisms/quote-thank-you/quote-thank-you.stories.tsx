import { Meta, StoryFn } from '@storybook/react';
import QuoteThankYou from '.';

export default {
  title: 'Organisms/Quote Thank You',
  component: QuoteThankYou,
} as Meta<typeof QuoteThankYou>;

const Template: StoryFn<typeof QuoteThankYou> = (args) => <QuoteThankYou {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  account: {
    email: 'madilyn@gmail.com',
  },
  quoteRequestId: '1155 2224 4452',
  deliveryMethod: '2023-01-15 with UPS',
  deliveryAddress: {
    id: '1',
    name: 'commercetools1',
    careOf: 'Madilyn Newman',
    line1: 'Fiolvägen 33',
    zip: '433 22',
    city: 'Stockholm',
    country: 'Sweden',
  },
  paymentMethod: 'Purchase Order ***',
  billingAddress: {
    id: '1',
    name: 'commercetools1',
    careOf: 'Madilyn Newman',
    line1: 'Fiolvägen 33',
    zip: '433 22',
    city: 'Stockholm',
    country: 'Sweden',
  },
  comment: 'Can I have a 10% discount on Bd10T789?',
  lineItems: [
    {
      id: '1',
      name: 'Brake Pad Set, disc brake DELPHI L20',
      price: 115.99,
      currency: 'USD',
      quantity: 4,
      images: ['/brake-pad.png'],
    },
    {
      id: '2',
      name: 'Brake Pad Set, disc brake DELPHI L20',
      price: 115.99,
      currency: 'USD',
      quantity: 3,
      images: ['/brake-pad.png'],
    },
  ],
  transaction: {
    subtotal: 266.99,
    shipping: 23.99,
    taxes: 4.99,
    total: 299.99,
    discounts: 0,
    currency: 'USD',
  },
};
