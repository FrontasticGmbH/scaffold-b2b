import { Meta, StoryFn } from '@storybook/react';
import { ChatBubbleLeftRightIcon as QuotesIcon } from '@heroicons/react/24/outline';
import Card from '.';

export default {
  title: 'Molecules/Card',
  component: Card,
} as Meta<typeof Card>;

const Template: StoryFn<typeof Card> = (args) => <Card {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  icon: <QuotesIcon />,
  title: 'Quotes',
  summary: 'Check and manage the status of quote-requests',
};
