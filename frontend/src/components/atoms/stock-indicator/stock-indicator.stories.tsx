import { Meta, StoryFn } from '@storybook/react';
import StockIndicator from '.';

export default {
  title: 'Atoms/Stock Indicator',
  component: StockIndicator,
  tags: ['autodocs'],
} as Meta<typeof StockIndicator>;

const Template: StoryFn<typeof StockIndicator> = (args) => <StockIndicator {...args} />;

export const InStock = Template.bind({});
InStock.args = {
  inStock: true,
};

export const OutOfStock = Template.bind({});
OutOfStock.args = {
  inStock: false,
};

export const Restockable = Template.bind({});
Restockable.args = {
  inStock: false,
  restockableInDays: 2,
};
