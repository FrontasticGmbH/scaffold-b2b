import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Toggle from '.';

export default {
  title: 'Atoms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
} as Meta<typeof Toggle>;

const Template: StoryFn<typeof Toggle> = (args) => <Toggle {...args} />;

export const Default = Template.bind({});

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Set as active',
};
