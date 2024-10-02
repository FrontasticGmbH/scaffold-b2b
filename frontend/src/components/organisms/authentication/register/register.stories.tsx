import { Meta, StoryFn } from '@storybook/react';
import { image } from '@/mocks/image';
import Register from '.';

export default {
  title: 'Organisms/Register',
  component: Register,
} as Meta<typeof Register>;

const Template: StoryFn<typeof Register> = (args) => <Register {...args} />;

export const Default = Template.bind({});
Default.args = {
  logoLink: { href: '/' },
  logo: { src: '/sb-assets/THE B2B STORE.png', width: 1481, height: 84 },
  image: {
    src: image.url,
    width: 680,
    height: 340,
    alt: '',
  },
};
