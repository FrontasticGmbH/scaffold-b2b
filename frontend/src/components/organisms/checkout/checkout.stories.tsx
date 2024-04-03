import { Meta, StoryFn } from '@storybook/react';
import { checkout } from '@/mocks/checkout';
import Checkout from '.';

export default {
  title: 'Organisms/Checkout',
  component: Checkout,
} as Meta<typeof Checkout>;

const Template: StoryFn<typeof Checkout> = () => <Checkout {...checkout} />;

export const Primary = Template.bind({});
Primary.args = {};
