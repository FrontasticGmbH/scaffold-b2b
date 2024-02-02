import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Button from '@/components/atoms/button';
import { AddedToCartModalProps } from '@/components/molecules/added-to-cart-modal/types';
import { sliderItems } from '@/mocks/productSliderItems';
import AddedToCartModal from './index';

export default {
  title: 'Molecules/Added To Cart Modal',
  component: AddedToCartModal,
  tags: ['autodocs'],
} as Meta<typeof AddedToCartModal>;

const Template: StoryFn<AddedToCartModalProps> = (args) => {
  const [, setOpen] = useState(false);
  return (
    <div className="mt-6 w-full">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <AddedToCartModal {...args} onClose={() => setOpen(false)} />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  item: sliderItems[0],
  sliderProducts: sliderItems,
};
