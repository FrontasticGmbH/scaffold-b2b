import { Meta, StoryFn } from '@storybook/react';
import Label from '.';

export default {
  title: 'Atoms/Label',
  component: Label,
} as Meta<typeof Label>;

const Template: StoryFn<typeof Label> = (args) => (
  <div className="w-[100px]">
    <Label {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  children: 'Label',
};

export const Required = Template.bind({});
Required.args = {
  children: 'Label',
  required: true,
};
