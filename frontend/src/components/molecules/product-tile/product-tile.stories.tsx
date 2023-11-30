import { Meta, StoryFn } from '@storybook/react';
import { Product as ProductType } from '@/types/entity/product';
import ProductTile from '.';

export default {
  title: 'Molecules/Product Tile',
  component: ProductTile,
  argTypes: {
    variant: {
      control: 'select',
      options: ['grid-item', 'list-item'],
    },
  },
} as Meta<typeof ProductTile>;

const Template: StoryFn<typeof ProductTile> = (args) => <ProductTile {...args} />;

const item = {
  id: '0',
  name: 'Brake Pad Set, disc brake DELPHI LP20',
  description:
    'Print Technology: Inkjet\nMax Print Resolution: 4800 x 1200 dpi\nPrint Speed: 13 pages/minute\nColor Depth: 48-bit internal / 24-bit external (Scanner)\nDuplex Printing: Yes (Automatic)\nPaper Sizes: A4, Letter, Legal, 4"x6"',
  model: 'SHXM4AY55N',
  inStock: true,
  maxQuantity: 10,
  price: 734.64,
  currency: 'USD',
  image: '/brake-disk.png',
} as ProductType;

export const GridItem = Template.bind({});
GridItem.args = {
  item,
  variant: 'grid-item',
};

export const ListItem = Template.bind({});
ListItem.args = {
  item,
  variant: 'list-item',
};

export const Discounted = Template.bind({});
Discounted.args = {
  item: { ...item, discountedPrice: item.price / 2 },
  variant: 'list-item',
};
