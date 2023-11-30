import { Meta, StoryFn } from '@storybook/react';
import ActivityLog from '.';

export default {
  title: 'Molecules/Activity Log',
  component: ActivityLog,
  tags: ['autodocs'],
} as Meta<typeof ActivityLog>;

const Template: StoryFn<typeof ActivityLog> = (args) => <ActivityLog {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  activities: [
    {
      title: 'Quote request submitted',
      summary: '11/03/23 15:33 - by Erika',
      comment: 'Can I have a 10% discount on Bd10T789?',
    },
    {
      title: 'Quote Accepted by Seller',
      summary: '11/03/23 15:33 - by Anders',
      comment: 'I have applied your discount Erika!',
    },
    {
      title: 'Awaiting reply from you',
      reply: true,
      ctaLink: 'Request to Renogitiate',
    },
  ],
};
