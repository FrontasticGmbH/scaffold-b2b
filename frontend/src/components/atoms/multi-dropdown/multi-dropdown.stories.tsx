import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import {
  BookmarkIcon as BookmarkIcon,
  BellAlertIcon as NotificationIcon,
  BeakerIcon as ExperimentalIcon,
  Bars3CenterLeftIcon as MenuIcon,
} from '@heroicons/react/24/solid';
import Dropdown from '.';

export default {
  title: 'Atoms/ Multi Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'lg'],
    },
  },
} as Meta<typeof Dropdown>;

const Template: StoryFn<typeof Dropdown> = (args) => <Dropdown {...args} />;

const options = [
  { Icon: <BookmarkIcon width={24} color="red" />, name: 'Bookmarks', value: 'bookmarks' },
  { Icon: <NotificationIcon width={24} color="blue" />, name: 'Notifications', value: 'notifications' },
  { Icon: <ExperimentalIcon width={24} color="green" />, name: 'Experimental Features', value: 'experimental' },
];

const getOptionDisplay = ({ Icon, name }: (typeof options)[0]) => {
  return (
    <div className="flex items-center gap-2">
      {Icon}
      <span>{name}</span>
    </div>
  );
};

const children = (
  <>
    <Dropdown.Button>
      {({ selected }) => (
        <div className="flex items-center gap-4">
          {selected?.length > 0
            ? selected.map((value) =>
                getOptionDisplay(options.find((option) => option.value === value.value) as (typeof options)[0]),
              )
            : getOptionDisplay({ Icon: <MenuIcon width={24} color="gray" />, name: 'Menu', value: 'menu' })}
        </div>
      )}
    </Dropdown.Button>
    <Dropdown.Options>
      {options.map((option) => (
        <Dropdown.Option key={option.value} value={option.value}>
          {getOptionDisplay(option)}
        </Dropdown.Option>
      ))}
    </Dropdown.Options>
  </>
);

export const Default = Template.bind({});
Default.args = {
  children,
};

export const Controlled = Template.bind({});
Controlled.args = {
  value: ['bookmarks', 'notifications'],
  children,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  children,
};
