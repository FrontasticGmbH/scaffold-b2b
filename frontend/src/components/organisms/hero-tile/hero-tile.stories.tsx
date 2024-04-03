import { Meta, StoryFn } from '@storybook/react';
import { image } from '@/mocks/image';
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
      mediaId: image.mediaId,
      resourceType: 'image',
      name: image.name,
      tags: [],
      file: image.url,
      size: 516362,
      width: 1378,
      height: 1378,
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
