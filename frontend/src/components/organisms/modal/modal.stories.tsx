import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Button from '@/components/atoms/button';
import useMediaQuery from '@/hooks/useMediaQuery';
import { mobile } from '@/constants/screensizes';
import Modal from './index';

export default {
  title: 'Organisms/Modal',
  component: Modal,
  tags: ['autodocs'],
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => {
  const [open, setOpen] = useState(false);
  const [isLargerThanMobile] = useMediaQuery(mobile);
  const variant = isLargerThanMobile ? 'default' : 'sticky-bottom';
  return (
    <div className="mt-6 w-full">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Modal
        {...args}
        variant={variant}
        isOpen={open}
        closeButton={true}
        onRequestClose={() => setOpen(false)}
        className="bg-white"
      />
    </div>
  );
};

export const Small = Template.bind({});
Small.args = { size: 'sm' };
export const Medium = Template.bind({});
Medium.args = { size: 'md' };
export const Large = Template.bind({});
Large.args = { size: 'lg' };
