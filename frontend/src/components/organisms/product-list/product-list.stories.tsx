'use client';

import { Meta, StoryFn } from '@storybook/react';
import ProductList from '.';

export default {
  title: 'Organisms/Product List',
  component: ProductList,
} as Meta<typeof ProductList>;

const Template: StoryFn<typeof ProductList> = (args) => <ProductList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  products: Array.from({ length: 20 }, (_, index) => ({
    id: index.toString(),
    name: 'Brake Pad Set, disc brake DELPHI LP20',
    specifications: [
      {
        label: 'capacity',
        value: '600',
      },
      {
        label: 'model',
        value: '2015',
      },
      {
        label: 'iso45001',
        value: 'true',
      },
      {
        label: 'mobility',
        value: 'tracked',
      },
    ],
    sku: 'SHXM4AY55N',
    inStock: true,
    maxQuantity: 10,
    price: 734.64,
    currency: 'USD',
    image: './sb-assets/brake-disk.png',
    images: ['./sb-assets/brake-disk.png'],
  })),
  title: 'Brake System',
  breadcrumb: [
    { name: 'Home', link: '#' },
    { name: 'Brake Systems', link: '#' },
  ],
  limit: 30,
  total: 145,
  sortValues: [
    { name: 'Featured', value: 'featured', vector: 'asc' },
    { name: 'Price', value: 'price', vector: 'asc' },
    { name: 'Best-Selling', value: 'best-selling', vector: 'asc' },
    { name: 'Newest', value: 'newest', vector: 'asc' },
  ],
  currentSortValue: 'featured',
  facets: [
    {
      id: 'category',
      name: 'Category',
      type: 'navigation',
      selected: true,
      values: [
        { id: '0', name: 'View all', count: 145, selected: true },
        { id: '1', name: 'Disc brakes', count: 26 },
        { id: '2', name: 'Drum brakes', count: 16 },
        { id: '3', name: 'Anti-lock brakes', count: 34 },
        { id: '4', name: 'Regenerative brakes', count: 312 },
      ],
      maxVisibleItems: 3,
    },
    {
      id: 'manufacturer',
      name: 'Manufacturer',
      type: 'term',
      selected: true,
      values: [
        { id: '0', name: 'Audi', count: 2, selected: true },
        { id: '1', name: 'Braun', count: 0 },
        { id: '2', name: 'Fiat', count: 6, selected: true },
        { id: '3', name: 'Kia', count: 12 },
        { id: '4', name: 'Volvo', count: 2 },
      ],
      maxVisibleItems: 3,
    },
    {
      id: 'price',
      name: 'Price',
      type: 'range',
    },
    {
      id: 'special-offers',
      name: 'Special Offers',
      type: 'term',
      values: [
        { id: '0', name: 'Regular', count: 44 },
        { id: '1', name: 'Sale', count: 12 },
      ],
    },
  ],
};
