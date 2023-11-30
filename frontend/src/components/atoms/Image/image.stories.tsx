import { Meta, StoryFn } from '@storybook/react';
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
    mediaId: 'ynxtwuvnvlluue6fexog',
    resourceType: 'image',
    name: 'AdobeStock 510169269',
    tags: ['__none'],
    file: 'https://res.cloudinary.com/dlwdq84ig/image/upload/ynxtwuvnvlluue6fexog',
    size: 516362,
    width: 1378,
    height: 1378,
    format: 'jpg',
  },
};

export const UnOptimized = Template.bind({});
UnOptimized.args = {
  src: 'https://res.cloudinary.com/dlwdq84ig/image/upload/ynxtwuvnvlluue6fexog',
  width: 680,
  height: 340,
};
