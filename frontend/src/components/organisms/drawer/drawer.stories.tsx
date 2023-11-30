import { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Button from '@/components/atoms/button';
import Drawer from './index';
import { DrawerProps } from './types';

export default {
  title: 'Organisms/Drawer',
  component: Drawer,
  tags: ['autodocs'],
} as Meta<typeof Drawer>;

const Template: StoryFn<typeof Drawer> = ({ headline = 'Headline' }) => {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<DrawerProps['direction']>('left');

  const leftDrawerClick = () => {
    setDirection('left');
    setOpen(true);
  };

  const rightDrawerClick = () => {
    setDirection('right');
    setOpen(true);
  };
  return (
    <div className="mt-6 w-full">
      <div className="flex w-[25%] flex-col gap-y-8">
        <Button variant="primary" onClick={leftDrawerClick}>
          Open Left Drawer
        </Button>
        <Button variant="primary" onClick={rightDrawerClick}>
          Open Right Drawer
        </Button>
      </div>

      <Drawer headline={headline} direction={direction} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};
export const Default = Template.bind({});
