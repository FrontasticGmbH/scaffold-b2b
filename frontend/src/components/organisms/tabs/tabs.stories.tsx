import { Meta, StoryFn } from '@storybook/react';
import Tabs from '.';

export default {
  title: 'Organisms/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} as Meta<typeof Tabs>;

const Template: StoryFn<typeof Tabs> = (args) => <Tabs {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: (
    <>
      <Tabs.TabList>
        <Tabs.Tab>Tab 1</Tabs.Tab>
        <Tabs.Tab>Tab 2</Tabs.Tab>
        <Tabs.Tab>Tab 3</Tabs.Tab>
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>Panel 1</Tabs.Panel>
        <Tabs.Panel>Panel 2</Tabs.Panel>
        <Tabs.Panel>Panel 3</Tabs.Panel>
      </Tabs.Panels>
    </>
  ),
};
