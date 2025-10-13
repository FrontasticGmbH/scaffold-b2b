import { PurchaseListItem as PurchaseListItemType } from '@/types/entity/purchase-list';
import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import PurchaseListItem from '.';

export default {
  title: 'Molecules/Purchase List Item',
  component: PurchaseListItem,
} as Meta<typeof PurchaseListItem>;

const Template: StoryFn<typeof PurchaseListItem> = (args) => {
  const [quantity, setQuantity] = useState(0);

  const handleChange = async (qty: number) => {
    setQuantity(qty);
    return true;
  };

  return <PurchaseListItem {...args} item={{ ...args.item, quantity }} onQuantityChange={handleChange} />;
};

const item = {
  id: '0',
  url: '#',
  name: 'Brake Pad Set, disc brake DELPHI LP20',
  sku: 'SHXM4AY55N',
  inStock: true,
  price: 734.64,
  currency: 'USD',
  image: '/sb-assets/brake-disk.png',
  specifications: [],
  quantity: 1,
} as PurchaseListItemType;

export const Primary = Template.bind({});
Primary.args = {
  item: {
    ...item,
    maxQuantity: 10,
    specifications: [
      { label: 'Manufacturer', value: 'ERA' },
      { label: 'Part Number', value: '770035A' },
      { label: 'Pressure', value: '0,3 bar' },
      { label: 'Weight', value: '563 gram' },
    ],
  },
};

export const OutOfStock = Template.bind({});
OutOfStock.args = {
  item: { ...item, inStock: false, maxQuantity: 0 },
};
