import { Meta, StoryFn } from '@storybook/react';
import { image } from '@/mocks/image';
import Login from '.';

export default {
  title: 'Organisms/Login',
  component: Login,
} as Meta<typeof Login>;

const Template: StoryFn<typeof Login> = (args) => <Login {...args} />;

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
