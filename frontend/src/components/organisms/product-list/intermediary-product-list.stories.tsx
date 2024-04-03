'use client';

import { Meta, StoryFn } from '@storybook/react';
import IntermediaryProductList from './components/intermediary-page';

export default {
  title: 'Organisms/Intermediary Product List',
  component: IntermediaryProductList,
} as Meta<typeof IntermediaryProductList>;

const Template: StoryFn<typeof IntermediaryProductList> = (args) => <IntermediaryProductList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Computers',
  breadcrumb: [
    { name: 'Home', link: '#' },
    { name: 'Computer', link: '#' },
  ],
  link: { name: 'Shop All', href: '#' },
  items: [
    { name: 'Desktops', image: { src: '/sb-assets/desktops.png' } },
    { name: 'Laptops', image: { src: '/sb-assets/laptops.jpeg' } },
    { name: 'Tablets', image: { src: '/sb-assets/tablets.jpeg' } },
    { name: 'View All', image: { src: '/sb-assets/computers.jpeg' } },
  ],
  highlight: {
    headline: 'Laptop Choices for Performance and Style',
    subline: 'Discover the perfect blend of power and elegance with our curated selection of laptops.',
    cta: { name: 'Shop Laptops', href: '#' },
    items: [
      {
        name: 'Microsoft Surface 12.4" ',
        price: 1259,
        currency: 'USD',
        image: { src: '/sb-assets/laptop-focus-mode.jpeg' },
        pressTargetPosition: 'top',
        url: '#',
      },
      {
        name: 'ASUS E410 Celeron 14”',
        price: 1259,
        currency: 'USD',
        image: { src: '/sb-assets/asus-laptop.jpeg' },
        pressTargetPosition: 'bottom',
        url: '#',
      },
    ],
  },
};
