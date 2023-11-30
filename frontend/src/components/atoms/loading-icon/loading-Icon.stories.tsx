import { Meta, StoryFn } from '@storybook/react';
import LoadingIcon from './index';

export default {
  title: 'Atoms/Loading Icon',
  component: LoadingIcon,
  tags: ['autodocs'],
} as Meta<typeof LoadingIcon>;

const Template: StoryFn<typeof LoadingIcon> = ({
  svgWidth = 120,
  svgHeight = 120,
  className = 'fill-gray-700',
  ...args
}) => <LoadingIcon svgWidth={svgWidth} svgHeight={svgHeight} className={className} {...args} />;

export const Default = Template.bind({});
