import { Meta, StoryFn } from '@storybook/react';
import logoSrc from 'public/THE B2B STORE.svg';
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
  logo: { src: logoSrc },
  image: {
    src: image.url,
    width: 680,
    height: 340,
    alt: '',
  },
};
