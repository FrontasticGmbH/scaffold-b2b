import { Meta, StoryFn } from '@storybook/react';
import MoveToList from '.';

export default {
  title: 'Molecules/Move to list',
  component: MoveToList,
} as Meta<typeof MoveToList>;

export const mockupLists = Array(10)
  .fill(0)
  .map((val, index) => {
    const unq = 'supplies-' + index;
    return {
      label: 'Supplies',
      id: unq,
    };
  });

const Template: StoryFn<typeof MoveToList> = () => <MoveToList lists={mockupLists} />;

export const Primary = Template.bind({});
Primary.args = {};
