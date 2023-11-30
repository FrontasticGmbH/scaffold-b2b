import { Meta, StoryFn } from '@storybook/react';
import Spacer from '.';

export default {
  title: 'Atoms/Spacer',
  component: Spacer,
  tags: ['autodoc'],
  argTypes: {
    bgColor: {
      control: 'select',
      options: ['white', 'neutral-200'],
    },
  },
} as Meta<typeof Spacer>;

const Template: StoryFn<typeof Spacer> = (args) => <Spacer {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  bgColor: 'neutral-200',
  space: 24,
};
