import { Meta, StoryFn } from '@storybook/react';
import SectionHeader from '.';

export default {
  title: 'Molecules/Section Header',
  component: SectionHeader,
} as Meta<typeof SectionHeader>;

const Template: StoryFn<typeof SectionHeader> = (args) => <SectionHeader {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Product Categories',
  link: {
    name: 'All categories',
  },
};
