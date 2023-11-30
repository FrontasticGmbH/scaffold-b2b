import { Meta, StoryFn } from '@storybook/react';
import ShowMore from '.';

export default {
  title: 'Molecules/Show More',
  component: ShowMore,
} as Meta<typeof ShowMore>;

const Template: StoryFn<typeof ShowMore> = (args) => (
  <div className="text-14 leading-[200%] text-gray-700">
    <p>Manufacturer - ERA</p>
    <ShowMore {...args} />
  </div>
);

export const Primary = Template.bind({});
Primary.args = {
  children: (
    <>
      <p>Part Number - 770035A</p>
      <p>Weight - 563 gram</p>
    </>
  ),
};
