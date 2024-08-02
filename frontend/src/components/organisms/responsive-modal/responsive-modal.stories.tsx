import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Button from '@/components/atoms/button';
import ResponsiveModal from '.';

export default {
  title: 'Organisms/ResponsiveModal',
  component: ResponsiveModal,
  tags: ['autodocs'],
} as Meta<typeof ResponsiveModal>;

const Template: StoryFn<typeof ResponsiveModal> = ({ closeButton = true }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 w-full">
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <ResponsiveModal isOpen={open} closeButton={closeButton} onRequestClose={() => setOpen(false)}>
        <div className="min-h-[400px] w-screen max-w-[600px] px-8 py-12">I&apos;m a modal!</div>
      </ResponsiveModal>
    </div>
  );
};

export const Default = Template.bind({});
