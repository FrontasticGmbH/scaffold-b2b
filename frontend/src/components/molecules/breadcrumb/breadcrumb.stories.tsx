import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Breadcrumb from '.';

export default {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
} as Meta<typeof Breadcrumb>;

const Template: StoryFn<typeof Breadcrumb> = (args) => <Breadcrumb {...args} />;

const categoryElements = React.Children.toArray(
  Array.from({ length: 10 }, (_, index) => (
    <span key={index} className="cursor-pointer">
      Category {index + 1}
    </span>
  )),
);

export const Primary = Template.bind({});
Primary.args = {
  Separator: '/',
  children: categoryElements,
};

export const Truncated = Template.bind({});
Truncated.args = {
  maxItems: 3,
  children: categoryElements,
};
