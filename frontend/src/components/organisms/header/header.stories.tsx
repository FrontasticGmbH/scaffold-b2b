import { Meta, StoryFn } from '@storybook/react';
import { resolveReference } from '@/utils/lib/resolve-reference';
import logoSrc from 'public/THE B2B STORE.svg';
import Header from '.';

export default {
  title: 'Organisms/Header',
  component: Header,
} as Meta<typeof Header>;

const Template: StoryFn<typeof Header> = (args) => <Header {...args} />;

const productListImage = [
  {
    id: '1',
    sku: 'SKU-110',
    image: { src: '/brake-disk.png', width: 45, height: 45 },
    name: 'PrecisionStop™ 494 Advanced Brake Pad Set',
    url: '/',
  },
  {
    id: '2',
    sku: 'SKU-111',
    image: { src: '/brake-pad.png', width: 45, height: 45 },
    name: 'UltraGrip™ 122 Performance Brake Pads',
    url: '/',
  },
  {
    id: '3',
    sku: 'SKU-112',
    image: { src: '/brake-system.png', width: 45, height: 45 },
    name: 'UltraGrip™ 555 Performance Brake Pads',
    url: '/',
  },
  {
    id: '4',
    sku: 'SKU-113',
    image: { src: '/brake-disk.png', width: 45, height: 45 },
    name: 'UltraGrip™ 555 Performance Brake Pads',
    url: '/',
  },
  {
    id: '5',
    sku: 'SKU-114',
    name: 'Brake Pad Set, disc brake DELPHI LP20',
    image: { src: '/brake-system.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '6',
    sku: 'SKU-115',
    name: 'Brake disc with caliper, LANA SS46',
    image: { src: '/brake-disk.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '7',
    sku: 'SKU-116',
    image: { src: '/brake-disk.png', width: 45, height: 45 },
    name: 'PrecisionStop™ 494 Advanced Brake Pad Set',
    url: '/',
  },
  {
    id: '8',
    sku: 'SKU-117',
    image: { src: '/brake-pad.png', width: 45, height: 45 },
    name: 'UltraGrip™ 122 Performance Brake Pads',
    url: '/',
  },
  {
    id: '9',
    sku: 'SKU-118',
    image: { src: '/brake-system.png', width: 45, height: 45 },
    name: 'UltraGrip™ 555 Performance Brake Pads',
    url: '/',
  },
  {
    id: '10',
    sku: 'SKU-119',
    image: { src: '/brake-disk.png', width: 45, height: 45 },
    name: 'UltraGrip™ 555 Performance Brake Pads',
    url: '/',
  },
  {
    id: '11',
    sku: 'SKU-120',
    name: 'Brake Pad Set, disc brake DELPHI LP20',
    image: { src: '/brake-system.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '12',
    sku: 'SKU-121',
    name: 'Brake disc with caliper, LANA SS46',
    image: { src: '/brake-disk.png', width: 45, height: 45 },
    url: '/',
  },
];

export const Primary = Template.bind({});
Primary.args = {
  pageLinks: [
    resolveReference({ type: 'link', link: '/' }, 'Member + Benefits'),
    resolveReference({ type: 'link', link: '/' }, 'Sale'),
    resolveReference({ type: 'link', link: '/' }, 'New items'),
  ],
  myAccount: {
    categoryId: 'my-account',
    name: 'My Account',
    path: '/my-account',
    subCategories: [
      {
        categoryId: 'dashboard',
        name: 'Dashboard',
        path: '/dashboard',
        subCategories: [],
      },
      {
        categoryId: 'orders',
        name: 'Orders',
        path: '/orders',
        subCategories: [],
      },
      {
        categoryId: 'quotes',
        name: 'Quotes',
        path: '/quotes',
        subCategories: [],
      },
      {
        categoryId: 'shopping-lists',
        name: 'Shopping Lists',
        path: '/shopping-lists',
        subCategories: [],
      },
      {
        categoryId: 'settings-and-security',
        name: 'Settings & Security',
        path: '/settings-and-security',
        subCategories: [],
      },
      {
        categoryId: 'addresses',
        name: 'Addresses',
        path: '/addresses',
        subCategories: [],
      },
    ],
  },
  categoryLinks: [
    {
      categoryId: 'ct-1',
      name: 'Category-1',
      path: '/',
      subCategories: [
        { categoryId: ' ct-3-sub-1', name: 'Sub-Category-1', path: '/', subCategories: [] },
        { categoryId: ' ct-3-sub-2', name: 'Sub-Category-2', path: '/', subCategories: [] },
        { categoryId: ' ct-3-sub-3', name: 'Sub-Category-3', path: '/', subCategories: [] },
        { categoryId: ' ct-3-sub-4', name: 'Sub-Category-4', path: '/', subCategories: [] },
      ],
    },
    {
      categoryId: 'ct-2',
      name: 'Category-2',
      path: '/',
      subCategories: [{ categoryId: 'ct-2-sub-1', name: 'Sub-Category-1', path: '/', subCategories: [] }],
    },
    {
      categoryId: 'ct-3',
      name: 'Category-3',
      path: '/',
      subCategories: [
        { categoryId: 'ct-3-sub-1', name: 'Sub-Category-1', path: '/', subCategories: [] },
        { categoryId: 'ct-3-sub-2', name: 'Sub-Category-2', path: '/', subCategories: [] },
        { categoryId: 'ct-3-sub-3', name: 'Sub-Category-3', path: '/', subCategories: [] },
        { categoryId: 'ct-3-sub-4', name: 'Sub-Category-4', path: '/', subCategories: [] },
      ],
    },
  ],
  logo: { src: logoSrc, width: 200, height: 100 },
  logoLink: resolveReference({ type: 'link', link: '/' }, 'Logo'),
  accountLink: resolveReference({ type: 'link', link: '/' }, 'Logo'),
  cartItems: 23,
  cartLink: resolveReference({ type: 'link', link: '/' }, 'Logo'),
  businessUnits: [
    { name: 'opt1', value: 'opt1' },
    { name: 'opt2', value: 'opt2' },
    { name: 'opt3', value: 'opt3' },
    { name: 'opt4', value: 'opt4' },
  ],
  stores: [
    { name: 'opt1', value: 'opt1' },
    { name: 'opt2', value: 'opt2' },
    { name: 'opt3', value: 'opt3' },
    { name: 'opt4', value: 'opt4' },
  ],
  quotas: 4,
  searchPlaceholder: 'Search by SKU number, product name or keyword',
  searchSuggestions: productListImage,
  quickOrderProducts: [
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
  ],
  csvDownloadLink: '/template.csv',
};
