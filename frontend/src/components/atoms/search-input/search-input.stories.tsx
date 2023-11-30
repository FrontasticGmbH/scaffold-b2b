import { Meta, StoryFn } from '@storybook/react';
import SearchInput from '.';

export default {
  title: 'Atoms/Search Input',
  component: SearchInput,
} as Meta<typeof SearchInput>;

const Template: StoryFn<typeof SearchInput> = (args) => <SearchInput {...args} />;

export const SmallFilter = Template.bind({});
SmallFilter.args = {
  label: 'Filter Search',
  variant: 'xs',
  placeholder: 'Search...',
};

export const Small = Template.bind({});
Small.args = {
  label: 'Small Search',
  variant: 'sm',
  placeholder: 'Search...',
};

export const Large = Template.bind({});
Large.args = {
  variant: 'lg',
  placeholder: 'Search by SKU, product or keyword',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Search',
  variant: 'xs',
  placeholder: 'Search...',
  disabled: true,
};
