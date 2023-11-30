import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Typography from '.';

export default {
  title: 'Atoms/Typography',
  component: Typography,
  tags: ['autodocs'],
} as Meta<typeof Typography>;

const Template: StoryFn<typeof Typography> = (args) => <Typography {...args}>Lorem ipsum Lorem ipsum</Typography>;

export const Default = Template.bind({});
Default.args = {};

export const Medium = Template.bind({});
Medium.args = {
  fontWeight: 'medium',
};

export const asSkeleton = Template.bind({});
asSkeleton.args = {
  fontSize: 18,
  className: 'w-fit',
  asSkeleton: true,
};
