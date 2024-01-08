import { Meta, StoryFn } from '@storybook/react';
import Gallery from '.';

export default {
  title: 'Organisms/Gallery',
  component: Gallery,
  tags: ['autodocs'],
} as Meta<typeof Gallery>;

const images = Array(10).fill('https://res.cloudinary.com/dlwdq84ig/image/upload/ynxtwuvnvlluue6fexog');

const Template: StoryFn<typeof Gallery> = () => <Gallery images={images} />;

export const Default = Template.bind({});
