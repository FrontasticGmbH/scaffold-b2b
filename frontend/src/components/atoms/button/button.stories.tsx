import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import Button from '.';

export default {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args}>{args.children ?? 'Button'}</Button>;

const AddToCartTemplate: StoryFn<typeof Button> = (args) => {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const toggleButtonFeedback = () => {
    setLoading(true);

    const loadingTimer = setTimeout(() => {
      setLoading(false);
      setAdded(true);
      clearTimeout(loadingTimer);

      const addedTimer = setTimeout(() => {
        setAdded(false);
        clearTimeout(addedTimer);
      }, 500);
    }, 1500);
  };

  return (
    <Button onClick={toggleButtonFeedback} loading={loading} added={added} {...args}>
      Button
    </Button>
  );
};

export const ExtraSmall = Template.bind({});
ExtraSmall.args = {
  size: 'xs',
};

export const Small = Template.bind({});
Small.args = {
  size: 's',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'm',
};

export const Large = Template.bind({});
Large.args = {
  size: 'l',
};

export const AddToCart = AddToCartTemplate.bind({});
AddToCart.args = {
  size: 'l',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
};

export const Warning = Template.bind({});
Warning.args = {
  variant: 'warning',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const Underlined = Template.bind({});
Underlined.args = {
  variant: 'underlined',
  children: 'Button text',
};

export const Ghost = Template.bind({});
Ghost.args = {
  variant: 'ghost',
};

export const RightIcon = Template.bind({});
RightIcon.args = {
  size: 'l',
  iconPosition: 'right',
  Icon: TrashIcon,
};

export const LeftIcon = Template.bind({});
LeftIcon.args = {
  size: 'l',
  iconPosition: 'left',
  Icon: TrashIcon,
};

export const OnlyIcon = Template.bind({});
OnlyIcon.args = {
  Icon: TrashIcon,
  children: '',
};
