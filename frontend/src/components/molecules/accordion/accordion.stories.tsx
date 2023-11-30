import { Meta, StoryFn } from '@storybook/react';
import Accordion from '.';

export default {
  title: 'Organisms/Accordion',
  component: Accordion,
} as Meta<typeof Accordion>;

const Template: StoryFn<typeof Accordion> = (args) => <Accordion {...args} />;

const children = (
  <>
    <Accordion.Button>Click Me!</Accordion.Button>
    <Accordion.Panel>I&apos;m expanded!</Accordion.Panel>
  </>
);

export const Primary = Template.bind({});
Primary.args = {
  children,
};

export const DefaultExpanded = Template.bind({});
DefaultExpanded.args = {
  defaultIsExpanded: true,
  children,
};
