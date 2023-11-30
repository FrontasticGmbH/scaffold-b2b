import { Meta, StoryFn } from '@storybook/react';
import QuantityWidget from '.';

export default {
  title: 'Atoms/Quantity Widget',
  component: QuantityWidget,
} as Meta<typeof QuantityWidget>;

const Template: StoryFn<typeof QuantityWidget> = (args) => <QuantityWidget {...args} />;

export const Primary = Template.bind({});
