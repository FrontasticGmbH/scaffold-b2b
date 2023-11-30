import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Skeleton from '.';

export default {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} as Meta<typeof Skeleton>;

const Template: StoryFn<typeof Skeleton> = (args) => (
  <div>
    <Skeleton {...args} />
  </div>
);

export const RowsCount = Template.bind({});
RowsCount.args = {
  count: 4,
};

const Filler: StoryFn<typeof Skeleton> = () => (
  <div className="relative w-fit">
    <h3>text to be blurred while data is loading</h3>
    <Skeleton fillMode />
  </div>
);

export const FillMode = Filler.bind({});
FillMode.args = {};
