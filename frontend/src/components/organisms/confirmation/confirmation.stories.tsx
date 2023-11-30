import { Meta, StoryFn } from '@storybook/react';
import Button from '@/components/atoms/button';
import Confirmation from '.';

export default {
  title: 'Organisms/Confirmation',
  component: Confirmation,
} as Meta<typeof Confirmation>;

const Template: StoryFn<typeof Confirmation> = (args) => (
  <Confirmation {...args}>
    <Button variant="warning">DELETE</Button>
  </Confirmation>
);

export const Primary = Template.bind({});
Primary.args = {
  translations: {
    title: 'Delete Address',
    summary: 'Are you sure you want to permanently delete this address?',
    cancel: 'Cancel',
    confirm: 'Delete',
  },
};
