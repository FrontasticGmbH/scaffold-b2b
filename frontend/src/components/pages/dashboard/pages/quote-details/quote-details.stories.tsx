import { Meta, StoryFn } from '@storybook/react';
import { quote } from '@/mocks/quote';
import QuoteDetailsPage from '.';

export default {
  title: 'Pages/Quote Details',
  component: QuoteDetailsPage,
} as Meta<typeof QuoteDetailsPage>;

const Template: StoryFn<typeof QuoteDetailsPage> = () => <QuoteDetailsPage quote={quote} permissions={{}} />;

export const Primary = Template.bind({});
