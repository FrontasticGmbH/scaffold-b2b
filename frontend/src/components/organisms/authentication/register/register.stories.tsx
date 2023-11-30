import { Meta, StoryFn } from '@storybook/react';
import Register from '.';

export default {
  title: 'Organisms/Register',
  component: Register,
} as Meta<typeof Register>;

const Template: StoryFn<typeof Register> = (args) => <Register {...args} />;

export const Default = Template.bind({});
Default.args = {
  image: {
    src: 'https://res.cloudinary.com/dlwdq84ig/image/upload/ynxtwuvnvlluue6fexog',
    width: 680,
    height: 340,
    alt: '',
  },
};
