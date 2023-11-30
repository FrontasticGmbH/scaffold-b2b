import { Meta, StoryFn } from '@storybook/react';
import HeroTile from '.';

export default {
  title: 'Organisms/Hero Tile',
  component: HeroTile,
  tags: ['autodocs'],
} as Meta<typeof HeroTile>;

const Template: StoryFn<typeof HeroTile> = (args) => <HeroTile {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  image: {
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
    ratio: '16:9',
  },
  title: 'Hello, Erika!',
  links: [
    { name: 'Quotes', href: '#' },
    { name: 'Orders', href: '#' },
    { name: 'Company Admin', href: '#' },
  ],
};
