import { Meta, StoryFn } from '@storybook/react';
import Dashboard from '.';

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
} as Meta<typeof Dashboard>;

const Template: StoryFn<typeof Dashboard> = (args) => <Dashboard {...args} />;

export const Primary = Template.bind({});
