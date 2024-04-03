import { Meta, StoryFn } from '@storybook/react';
import { quote } from '@/mocks/quote';
import QuotesPage from '.';

export default {
  title: 'Pages/Quotes',
  component: QuotesPage,
} as Meta<typeof QuotesPage>;

const Template: StoryFn<typeof QuotesPage> = () => (
  <QuotesPage
    quotes={Array(5)
      .fill(0)
      .map(() => ({ ...quote, url: '#' }))}
    sortOptions={[{ name: 'Creation Date', value: 'creationDate' }]}
    filters={{ sort: 'creationDate' }}
    statusOptions={[
      { name: 'Accepted', value: 'accepted', count: 2 },
      { name: 'Pending', value: 'pending', count: 3 },
    ]}
    totalItems={5}
    page={1}
    limit={25}
  />
);

export const Primary = Template.bind({});
