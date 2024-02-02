import { Meta, StoryFn } from '@storybook/react';
import { sliderItems } from '@/mocks/productSliderItems';
import ProductSlider from '.';

export default {
  title: 'Organisms/Product Slider',
  component: ProductSlider,
} as Meta<typeof ProductSlider>;

const Template: StoryFn<typeof ProductSlider> = (args) => <ProductSlider {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  headline: 'Similiar products',
  products: sliderItems,
};
