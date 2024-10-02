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
    { title: 'Engine', image: { src: './sb-assets/engine.png' } },
    { title: 'Filters', image: { src: './sb-assets/filters.png' } },
    { title: 'Suspensions', image: { src: './sb-assets/suspensions.png' } },
    { title: 'Exhaust system', image: { src: './sb-assets/exhaust-system.png' } },
    { title: 'Brake system', image: { src: './sb-assets/brake-system.png' } },
    { title: 'Fuel system', image: { src: './sb-assets/fuel-system.png' } },
    { title: 'Cooling system', image: { src: './sb-assets/cooling-system.png' } },
    { title: 'Electrics', image: { src: './sb-assets/electrics.png' } },
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
    { title: 'OPEL', image: { src: './sb-assets/opel-logo.png' } },
    { title: 'RENAULT', image: { src: './sb-assets/renault-logo.png' } },
    { title: 'TOYOTA', image: { src: './sb-assets/toyota-logo.png' } },
    { title: 'VOLVO', image: { src: './sb-assets/volvo-logo.png' } },
    { title: 'KIA', image: { src: './sb-assets/kia-logo.png' } },
    { title: 'FIAT', image: { src: './sb-assets/fiat-logo.png' } },
    { title: 'NISSAN', image: { src: './sb-assets/nissan-logo.png' } },
    { title: 'JEEP', image: { src: './sb-assets/jeep-logo.png' } },
  ],
};
