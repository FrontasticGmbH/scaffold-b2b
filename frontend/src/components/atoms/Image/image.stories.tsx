import { Meta, StoryFn } from '@storybook/react';
import { image } from '@/mocks/image';
import Image from '.';

export default {
  title: 'Atoms/Image',
  component: Image,
  tags: ['autodocs'],
} as Meta<typeof Image>;

const Template: StoryFn<typeof Image> = (args) => <Image {...args} />;

export const Optimized = Template.bind({});
Optimized.args = {
  media: {
    mediaId: image.mediaId,
    name: image.name,
    file: image.url,
    resourceType: 'image',
    tags: [],
    size: 516362,
    width: 1378,
    height: 1378,
  },
};

export const UnOptimized = Template.bind({});
UnOptimized.args = {
  src: image.url,
  width: 680,
  height: 340,
};
