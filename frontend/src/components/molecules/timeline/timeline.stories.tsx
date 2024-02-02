import { Meta, StoryFn } from '@storybook/react';
import Timeline from '.';

export default {
  title: 'Molecules/Timeline',
  component: Timeline,
} as Meta<typeof Timeline>;

const Template: StoryFn<typeof Timeline> = (args) => (
  <Timeline {...args}>
    <div className="text-left">
      <p className="text-gray-700">Order placed</p>
      <p className="text-14 text-gray-600">Tue, Jan 15</p>
    </div>
    <div className="text-center">
      <p className="text-gray-700">Shipped</p>
      <p className="text-14 text-gray-600">Tue, Jan 18</p>
    </div>
    <div className="text-right">
      <p className="text-gray-700">Est. Delivery</p>
      <p className="text-14 text-gray-600">Tue, Jan 22</p>
    </div>
  </Timeline>
);

export const Primary = Template.bind({});
Primary.args = {
  activeIndex: 0,
  classNames: {
    track: 'bg-gray-300',
    trackActive: 'bg-primary',
    bullet: 'bg-gray-300',
    bulletActive: 'bg-primary',
  },
};
