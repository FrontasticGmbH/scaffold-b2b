import { Meta, StoryFn } from '@storybook/react';
import Markdown from '.';

export default {
  title: 'Atoms/Markdown',
  component: Markdown,
} as Meta<typeof Markdown>;

const Template: StoryFn<typeof Markdown> = (args) => (
  <div className="max-w-[500px]">
    <Markdown {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  children: `\n**Automotive Trends in 2023**\n*Automotive trends are evolving to meet our changing needs and desires. With a growing emphasis on driver and passenger safety, automakers are technologies such as collision warning systems, automatic braking, and adaptive cruise control.*\n`,
};
