import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import RuleBuilder from '.';

export default {
  title: 'Organisms/Rule Builder',
  component: RuleBuilder,
} as Meta<typeof RuleBuilder>;

const Template: StoryFn<typeof RuleBuilder> = (args) => <RuleBuilder {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isPreview: false,
  criteria: [
    {
      key: 'totalPrice.centAmount',
      name: 'Cart amount',
      type: 'text',
      operators: [
        { name: 'Is equal', value: '=' },
        { name: 'Is more than', value: '>' },
        { name: 'Is less than', value: '<' },
      ],
    },
    {
      key: 'currency',
      name: 'Cart currency',
      type: 'enum',
      operators: [
        { name: 'Is', value: 'is' },
        { name: 'Is not', value: 'is not' },
      ],
      values: [
        { name: 'USD', value: 'usd' },
        { name: 'EUR', value: 'eur' },
      ],
    },
  ],
};
