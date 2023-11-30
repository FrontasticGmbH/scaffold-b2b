import { Meta, StoryFn } from '@storybook/react';
import Login from '.';

export default {
  title: 'Organisms/Login',
  component: Login,
} as Meta<typeof Login>;

const Template: StoryFn<typeof Login> = (args) => <Login {...args} />;

export const Default = Template.bind({});
Default.args = {
  image: {
    src: 'https://res.cloudinary.com/dlwdq84ig/image/upload/ynxtwuvnvlluue6fexog',
    width: 680,
    height: 340,
    alt: '',
  },
};
