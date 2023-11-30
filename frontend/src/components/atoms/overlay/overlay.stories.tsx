import { Meta, StoryFn } from '@storybook/react';
import Overlay from './index';

export default {
  title: 'Atoms/Overlay',
  component: Overlay,
} as Meta<typeof Overlay>;

const Template: StoryFn<typeof Overlay> = () => <Overlay />;

export const Default = Template.bind({});
