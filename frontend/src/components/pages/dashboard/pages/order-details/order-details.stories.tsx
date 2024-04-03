import { Meta, StoryFn } from '@storybook/react';
import { orders } from '@/mocks/orders';
import OrderDetailsPage from '.';

export default {
  title: 'Pages/Order Details',
  component: OrderDetailsPage,
} as Meta<typeof OrderDetailsPage>;

const Template: StoryFn<typeof OrderDetailsPage> = (args) => <OrderDetailsPage {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  order: orders[0],
};
