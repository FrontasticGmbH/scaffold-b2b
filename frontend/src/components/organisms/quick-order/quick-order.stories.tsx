import { Meta, StoryFn } from '@storybook/react';
import QuickOrderDesktop from './quick-order-desktop';

export default {
  title: 'Organisms/Quick Order',
  component: QuickOrderDesktop,
} as Meta<typeof QuickOrderDesktop>;

const items = [
  {
    id: '1',
    sku: 'SKU-110',
    name: '001-Oil-filter-A1',
    maxQuantity: 33,
  },
  {
    id: '2',
    sku: 'SKU-111',
    name: '002-Spark-plug-B2',
    maxQuantity: 33,
  },
  {
    id: '3',
    sku: 'SKU-112',
    name: '003-Brake-pad-C3',
    maxQuantity: 33,
  },
  {
    id: '4',
    sku: 'SKU-113',
    name: '004-Air-filter-D4',
    maxQuantity: 33,
  },
  {
    id: '5',
    sku: 'SKU-114',
    name: '005-Headlight-bulb-E5',
    maxQuantity: 33,
  },
  {
    id: '6',
    sku: 'SKU-115',
    name: '006-Headlight-bulb-E6',
    maxQuantity: 33,
  },
  {
    id: '7',
    sku: 'SKU-116',
    name: 'PrecisionStop™ 494 Advanced Brake Pad Set',
    maxQuantity: 33,
  },
  {
    id: '8',
    sku: 'SKU-117',
    name: 'UltraGrip™ 122 Performance Brake Pads',
    maxQuantity: 33,
  },
  {
    id: '9',
    sku: 'SKU-118',
    name: 'UltraGrip™ 555 Performance Brake Pads',
    maxQuantity: 33,
  },
  {
    id: '10',
    sku: 'SKU-119',
    name: 'UltraGrip™ 555 Performance Brake Pads',
    maxQuantity: 33,
  },
  {
    id: '11',
    sku: 'SKU-120',
    name: 'Brake Pad Set, disc brake DELPHI LP20',
    maxQuantity: 33,
  },
  {
    id: '12',
    sku: 'SKU-121',
    name: 'Brake disc with caliper, LANA SS46',
    maxQuantity: 33,
  },
];

const Template: StoryFn<typeof QuickOrderDesktop> = (args) => <QuickOrderDesktop {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  items: items,
  downloadLink: '/template.csv',
};
