import { Meta, StoryFn } from '@storybook/react';
import Footer from '.';

export default {
  title: 'Organisms/Footer',
  component: Footer,
  tags: ['autodocs'],
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = (args) => <Footer {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'default',
  links: [
    { name: 'Orders & returns', href: '#' },
    { name: 'Help & contact', href: '#' },
    { name: 'Terms & conditions', href: '#' },
    { name: 'FAQ', href: '#' },
  ],
  copyrightStatement: '© Powered by commercetools',
};

export const Simple = Template.bind({});
Simple.args = {
  variant: 'simple',
  copyrightStatement: '© Powered by commercetools',
};
