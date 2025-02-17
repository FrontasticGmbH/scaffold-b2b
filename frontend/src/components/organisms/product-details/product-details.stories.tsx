import { Meta, StoryFn } from '@storybook/react';
import { Product } from '@/types/entity/product';
import ProductDetails from '.';

export default {
  title: 'Organisms/Product Details',
  component: ProductDetails,
  tags: ['autodocs'],
} as Meta<typeof ProductDetails>;

const images = Array(10).fill('/sb-assets/bearing.png');

const shoppingLists = Array(10)
  .fill(0)
  .map((val, index) => {
    const unq = 'supplies-' + index;
    return {
      label: 'Supplies',
      id: unq,
      lineItemId: unq,
    };
  });

const commonProductProps: Product = {
  id: '1',
  currency: 'USD',
  name: 'ASUS E410 Intel Celeron N4020 4GB 64GB 14-Inch HD LED Win 10 Laptop (Star Black)',
  sku: 'Model# SHXM4AY55N',
  price: 99,
  images: images,
};

const Template: StoryFn<typeof ProductDetails> = ({ ...args }) => (
  <ProductDetails
    {...args}
    getWishlists={() => {
      return Promise.resolve(shoppingLists);
    }}
    shippingMethods={[
      {
        label: 'Standard Shipping',
        description: '3-5 days',
        price: 3000,
        estimatedDeliveryDays: 3,
      },
    ]}
  />
);

export const ColorVariant = Template.bind({});
ColorVariant.args = {
  product: {
    ...commonProductProps,
    colors: [
      { label: 'Light Blue', value: 'lightblue' },
      { label: 'Saddle Brown', value: 'saddlebrown' },
    ],
  },
  currentColor: { label: 'Light Blue', value: 'lightblue' },
};

export const SpecsVariant = Template.bind({});
SpecsVariant.args = {
  product: {
    ...commonProductProps,
    specs: [
      { label: 'I7 / 16 RAM / 512 GB SSD', value: 'basic' },
      { label: 'I7 / 32 RAM / 1 TB SSD', value: 'premium' },
    ],
  },
  currentSpecs: { label: 'I7 / 16 RAM / 512 GB SSD', value: 'basic' },
};
