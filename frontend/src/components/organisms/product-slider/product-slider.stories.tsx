import { Meta, StoryFn } from '@storybook/react';
import ProductSlider from '.';

export default {
  title: 'Organisms/Product Slider',
  component: ProductSlider,
} as Meta<typeof ProductSlider>;

const Template: StoryFn<typeof ProductSlider> = (args) => <ProductSlider {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  headline: 'Similiar products',
  products: [
    {
      id: '1',
      name: 'Brake Pad Set, disc brake DELPHI LP20',
      model: 'Castrol',
      price: 9.64,
      priceRange: [9.64, 12.46],
      images: ['/brake-pad.png'],
      currency: 'USD',
    },
    {
      id: '2',
      name: 'Brake Disk Set, disc brake DELPHI LP20',
      model: 'Castrol',
      price: 9.64,
      discountedPrice: 3.64,
      images: ['/brake-disk.png'],
      currency: 'USD',
    },
    {
      id: '3',
      name: 'Brake System Set, disc brake DELPHI LP20',
      model: 'Castrol',
      price: 9.64,
      images: ['/brake-system.png'],
      currency: 'USD',
    },
    {
      id: '4',
      name: 'Brake Pad Set, disc brake DELPHI LP20',
      model: 'Castrol',
      price: 9.64,
      priceRange: [9.64, 12.46],
      images: ['/brake-pad.png'],
      currency: 'USD',
    },
    {
      id: '5',
      name: 'Brake Disk Set, disc brake DELPHI LP20',
      model: 'Castrol',
      price: 9.64,
      discountedPrice: 3.64,
      images: ['/brake-disk.png'],
      currency: 'USD',
    },
    {
      id: '6',
      name: 'Brake System Set, disc brake DELPHI LP20',
      model: 'Castrol',
      price: 9.64,
      images: ['/brake-system.png'],
      currency: 'USD',
    },
  ],
};
