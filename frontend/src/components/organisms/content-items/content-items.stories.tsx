import { Meta, StoryFn } from '@storybook/react';
import ContentItems from '.';

export default {
  title: 'Organisms/Content Items',
  component: ContentItems,
} as Meta<typeof ContentItems>;

const Template: StoryFn<typeof ContentItems> = (args) => <ContentItems {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
  title: 'Product Categories',
  link: {
    name: 'All categories',
  },
  items: [
    { title: 'Engine', image: { src: '/engine.png' } },
    { title: 'Filters', image: { src: '/filters.png' } },
    { title: 'Suspensions', image: { src: '/suspensions.png' } },
    { title: 'Exhaust system', image: { src: '/exhaust-system.png' } },
    { title: 'Brake system', image: { src: '/brake-system.png' } },
    { title: 'Fuel system', image: { src: '/fuel-system.png' } },
    { title: 'Cooling system', image: { src: '/cooling-system.png' } },
    { title: 'Electrics', image: { src: '/electrics.png' } },
  ],
};

export const Inline = Template.bind({});
Inline.args = {
  variant: 'inline',
  title: 'Product vehicle makes',
  link: {
    name: 'All vehicle makes',
  },
  items: [
    { title: 'OPEL', image: { src: '/opel-logo.png' } },
    { title: 'RENAULT', image: { src: '/renault-logo.png' } },
    { title: 'TOYOTA', image: { src: '/toyota-logo.png' } },
    { title: 'VOLVO', image: { src: '/volvo-logo.png' } },
    { title: 'KIA', image: { src: '/kia-logo.png' } },
    { title: 'FIAT', image: { src: '/fiat-logo.png' } },
    { title: 'NISSAN', image: { src: '/nissan-logo.png' } },
    { title: 'JEEP', image: { src: '/jeep-logo.png' } },
  ],
};
