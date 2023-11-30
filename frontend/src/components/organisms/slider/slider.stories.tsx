import { Meta, StoryFn } from '@storybook/react';
import Slider from '.';

export default {
  title: 'Organisms/Slider',
  component: Slider,
  tags: ['autodocs'],
} as Meta<typeof Slider>;

const Template: StoryFn<typeof Slider> = (args) => <Slider {...args} />;

const slideElements = Array.from({ length: 10 }, (_, index) => (
  <div key={index} className="bg-primary py-4 text-center text-white">
    <h1>{index + 1}</h1>
  </div>
));

export const Primary = Template.bind({});
Primary.args = {
  slidesToShow: 3.2,
  slidesToScroll: 1,
  arrows: true,
  arrowSize: 32,
  infinite: false,
  children: slideElements,
};

export const WithFixedWidthSlides = Template.bind({});
WithFixedWidthSlides.args = {
  slideWidth: 350,
  children: slideElements,
};
