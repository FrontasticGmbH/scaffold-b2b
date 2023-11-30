import { Meta, StoryFn } from '@storybook/react';
import Toaster from '.';
import Button from '../button';
import { ButtonProps } from '../button/types';
import toast from './helpers/toast';

export default {
  title: 'Atoms/Toaster',
  component: Toaster,
  tags: ['autodocs'],
} as Meta<typeof Toaster>;

const Template: StoryFn<ButtonProps> = (args) => <Button {...args}>Show</Button>;

export const Info = Template.bind({});
Info.args = {
  onClick: () => toast.info('This is an info message'),
};

export const Success = Template.bind({});
Success.args = {
  onClick: () => toast.success('This is a success message'),
};

export const Errored = Template.bind({});
Errored.args = {
  onClick: () => toast.error('This is an error message'),
};

export const Warning = Template.bind({});
Warning.args = {
  onClick: () => toast.warning('This is a warning message'),
};
