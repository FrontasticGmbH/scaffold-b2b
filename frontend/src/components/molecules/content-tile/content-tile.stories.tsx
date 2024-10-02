import { Meta, StoryFn } from '@storybook/react';
import ContentTile from '.';

export default {
  title: 'Molecules/Content Tile',
  component: ContentTile,
} as Meta<typeof ContentTile>;

const Template: StoryFn<typeof ContentTile> = (args) => (
  <div className="w-[320px]">
    <ContentTile {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  title: 'Hybrid battery systems',
  link: {
    name: 'Read more',
  },
  image: {
    src: '/sb-assets/car-front.png',
  },
};
