import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { PurchaseListItem as PurchaseListItemType } from '@/types/entity/purchase-list';
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
  manufacturer: 'ERA',
  partNumber: '770035A',
  pressure: '0,3 bar',
  weight: '563 gram',
  price: 734.64,
  currency: 'USD',
  image: '/sb-assets/brake-disk.png',
} as PurchaseListItemType;

export const Primary = Template.bind({});
Primary.args = {
  item: { ...item, maxQuantity: 10 },
};

export const OutOfStock = Template.bind({});
OutOfStock.args = {
  item: { ...item, inStock: false, maxQuantity: 0 },
};
