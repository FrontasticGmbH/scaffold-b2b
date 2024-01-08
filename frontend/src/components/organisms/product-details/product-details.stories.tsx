import { Meta, StoryFn } from '@storybook/react';
import { Product } from '@/types/entity/product';
import ProductDetails from '.';

export default {
  title: 'Organisms/Product Details',
  component: ProductDetails,
  tags: ['autodocs'],
} as Meta<typeof ProductDetails>;

const images = Array(10).fill('https://res.cloudinary.com/dlwdq84ig/image/upload/ynxtwuvnvlluue6fexog');

const shoppingLists = Array(10)
  .fill(0)
  .map((val, index) => {
    const unq = 'supplies-' + index;
    return {
      label: 'Supplies',
      id: unq,
    };
  });

const commonProductProps: Product = {
  id: '1',
  currency: 'USD',
  name: 'ASUS E410 Intel Celeron N4020 4GB 64GB 14-Inch HD LED Win 10 Laptop (Star Black)',
  model: 'Model# SHXM4AY55N',
  price: 99,
  images: images,
};

const Template: StoryFn<typeof ProductDetails> = ({ ...args }) => (
  <ProductDetails
    {...args}
    getWishlists={() => {
      return Promise.resolve(shoppingLists);
    }}
    additionalInfo={[
      {
        title: 'Product Details',
        description:
          'Introducing the ASUS E410 Intel Celeron N4020 Laptop in Star Black – your perfect daily companion. With a powerful Intel Celeron processor, 4GB RAM, and 64GB storage, this laptop effortlessly handles tasks. The 14-Inch HD LED display brings your content to life, while the sleek and lightweight design adds portability. Windows 10 ensures a user-friendly experience, and multiple connectivity options make it versatile for all your needs. Stay productive and entertained on the go with the ASUS E410.',
      },
      {
        title: 'Specifications',
        description: `Model: ASUS E410 Color: Star Black
          Processor: Intel Celeron N4020 (up to 2.8GHz, 4MB Cache) 
          Memory: 4GB DDR4 RAM 
          Storage: 64GB eMMC Flash Storage
          Display: 14-Inch HD LED (1366 x 768)
          Graphics: Intel UHD Graphics 600 
          Operating System: Windows 10
          Connectivity: Wi-Fi 5, Bluetooth 4.1 Ports: USB 3.2, USB 2.0, HDMI, MicroSD Card Reader
          Audio: Built-in Stereo Speakers, ASUS SonicMaster
          Camera: VGA Web Camera 
          Keyboard: Chiclet Keyboard
          Battery: 3-cell 42Whr Li-Polymer`,
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
