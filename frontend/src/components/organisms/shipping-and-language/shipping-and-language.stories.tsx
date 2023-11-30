import { Meta, StoryFn } from '@storybook/react';
import ShippingAndLanguageSection from '.';

export default {
  title: 'Organisms/Shipping and Language Section',
  component: ShippingAndLanguageSection,
} as Meta<typeof ShippingAndLanguageSection>;

const Template: StoryFn<typeof ShippingAndLanguageSection> = (args) => <ShippingAndLanguageSection {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  desktopDirection: 'left',
};
