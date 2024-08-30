import { Meta, StoryFn } from '@storybook/react';
import ContentItem from '.';
import { ContentItemProps } from './types';

export default {
  title: 'Molecules/Content Item',
  component: ContentItem,
  tags: ['autodocs'],
} as Meta<typeof ContentItem>;

const Template: StoryFn<ContentItemProps & { bg: string }> = ({ bg = '', ...args }) => (
  <div className={`p-6 ${bg}`}>
    <ContentItem {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  bg: 'bg-neutral-200',
  variant: 'default',
  image: {
    src: './sb-assets/engine.png',
  },
  title: 'Engine',
};

export const Inline = Template.bind({});
Inline.args = {
  variant: 'inline',
  image: {
    src: './sb-assets/skoda-logo.png',
  },
  title: 'SKODA',
};
