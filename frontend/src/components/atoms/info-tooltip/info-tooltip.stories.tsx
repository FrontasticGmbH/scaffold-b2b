import { Meta, StoryFn } from '@storybook/react';
import InfoTooltip from '.';

export default {
  title: 'Atoms/Info Tooltip',
  component: InfoTooltip,
  argTypes: {
    place: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
      ],
    },
  },
} as Meta<typeof InfoTooltip>;

const Template: StoryFn<typeof InfoTooltip> = (args) => <InfoTooltip {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Hover me!',
  content: "I'm a tooltip!",
  place: 'top-end',
};
