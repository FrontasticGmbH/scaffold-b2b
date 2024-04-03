import { Meta, StoryFn } from '@storybook/react';
import ContentSlider from '.';

export default {
  title: 'Organisms/Content Slider',
  component: ContentSlider,
} as Meta<typeof ContentSlider>;

const Template: StoryFn<typeof ContentSlider> = (args) => <ContentSlider {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  title: 'Explore latest Trends in Auto Manufacturing',
  link: {
    name: 'All articles',
  },
  items: [
    { title: 'Circular car seneors', link: { name: 'Read more' }, image: { src: '/sb-assets/car-sensor.png' } },
    { title: 'Hybrid batter systems', link: { name: 'Read more' }, image: { src: '/sb-assets/car-front.png' } },
    { title: 'Automotive trends in 2023', link: { name: 'Read more' }, image: { src: '/sb-assets/cars-trends.png' } },
    { title: 'Fuel-Efficient cruiser', link: { name: 'Read more' }, image: { src: '/sb-assets/car.png' } },
  ],
};
