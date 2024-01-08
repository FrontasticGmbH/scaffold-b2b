import { Meta, StoryFn } from '@storybook/react';
import ColoredVariant from '.';

export default {
  title: 'Atoms/Colored Variant',
  component: ColoredVariant,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
  },
} as Meta<typeof ColoredVariant>;

const Template: StoryFn<typeof ColoredVariant> = (args) => <ColoredVariant {...args} />;

export const Default = Template.bind({});
Default.args = {
  color: 'green',
};

export const Active = Template.bind({});
Active.args = {
  color: 'lightblue',
  active: true,
};
