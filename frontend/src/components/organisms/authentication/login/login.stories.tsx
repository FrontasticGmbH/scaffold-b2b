import { Meta, StoryFn } from '@storybook/react';
import logoSrc from 'public/THE B2B STORE.svg';
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
  logo: { src: logoSrc },
  image: {
    src: image.url,
    width: 680,
    height: 340,
    alt: '',
  },
};
