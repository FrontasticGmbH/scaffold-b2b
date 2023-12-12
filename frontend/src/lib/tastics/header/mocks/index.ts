import { resolveReference } from '@/utils/lib/resolve-reference';

export const pageLinks = [
  resolveReference({ type: 'link', link: '/' }, 'Member + Benefits'),
  resolveReference({ type: 'link', link: '/' }, 'Sale'),
  resolveReference({ type: 'link', link: '/' }, 'New items'),
];
export const myAccount = {
  categoryId: 'my-account',
  name: 'My Account',
  path: '/dashboard',
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
      path: '/dashboard/?hash=orders',
      subCategories: [],
    },
    {
      categoryId: 'quotes',
      name: 'Quotes',
      path: '/dashboard/?hash=quotes',
      subCategories: [],
    },
    {
      categoryId: 'shopping-lists',
      name: 'Shopping Lists',
      path: '/dashboard/?hash=shopping-lists',
      subCategories: [],
    },
    {
      categoryId: 'settings-and-security',
      name: 'Settings & Security',
      path: '/dashboard/?hash=settings',
      subCategories: [],
    },
    {
      categoryId: 'addresses',
      name: 'Addresses',
      path: '/dashboard/?hash=addresses',
      subCategories: [],
    },
  ],
};
export const categoryLinks = [
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
];
export const logo = { src: '/images/b2b-logo.png', width: 200, height: 100 };
export const logoLink = resolveReference({ type: 'link', link: '/' }, 'Logo');
export const accountLink = resolveReference({ type: 'link', link: '/' }, 'Logo');
export const cartItems = 23;
export const cartLink = resolveReference({ type: 'link', link: '/' }, 'Logo');

export const locations = [
  {
    flagName: 'sweden',
    name: 'Sweden',
    label: 'Sweden (SEK)',
    value: 'sv',
    defaultLanguage: { name: 'Svenska - SV', value: 'sv', label: 'Svenska' },
    languages: [
      { name: 'Svenska - SV', value: 'sv', label: 'Svenska' },
      { name: 'English - EN', value: 'en', label: 'English' },
    ],
  },
  {
    flagName: 'US',
    name: 'United States',
    label: 'United States (USD)',
    value: 'us',
    defaultLanguage: { name: 'English - EN', value: 'en', label: 'English' },
    languages: [{ name: 'English - EN', value: 'en', label: 'English' }],
  },
];
export const selectedLocation = {
  flagName: 'sweden',
  name: 'Sweden',
  label: 'Sweden (SEK)',
  value: 'sv',
  defaultLanguage: { name: 'Svenska - SV', value: 'sv', label: 'Svenska' },
  languages: [
    { name: 'Svenska - SV', value: 'sv', label: 'Svenska' },
    { name: 'English - EN', value: 'en', label: 'English' },
  ],
};

export const selectedLanguage = {
  name: 'Svenska - SV',
  value: 'sv',
  label: 'Svenska',
};
export const businessUnits = [
  { name: 'opt1', value: 'opt1' },
  { name: 'opt2', value: 'opt2' },
  { name: 'opt3', value: 'opt3' },
  { name: 'opt4', value: 'opt4' },
];
export const stores = [
  { name: 'opt1', value: 'opt1' },
  { name: 'opt2', value: 'opt2' },
  { name: 'opt3', value: 'opt3' },
  { name: 'opt4', value: 'opt4' },
];
export const name = 'Erika';
export const onLogoutClick = () => {};
export const textBar = 'Worldwide shipping & returns *';
export const quotas = '4';
export const suggestions = [
  {
    id: '1',
    sku: 'SKU-110',
    name: 'PrecisionStop™ 494 Advanced Brake Pad Set',
    image: { src: '/sb-assets/brake-disk.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '2',
    sku: 'SKU-111',
    name: 'UltraGrip™ 122 Performance Brake Pads',
    image: { src: '/sb-assets/brake-pad.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '3',
    sku: 'SKU-112',
    name: 'UltraGrip™ 555 Performance Brake Pads',
    image: { src: '/sb-assets/brake-system.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '4',
    sku: 'SKU-113',
    name: 'UltraGrip™ 555 Performance Brake Pads',
    image: { src: '/sb-assets/brake-disk.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '5',
    sku: 'SKU-114',
    name: 'Brake Pad Set, disc brake DELPHI LP20',
    image: { src: '/sb-assets/brake-system.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '6',
    sku: 'SKU-115',
    name: 'Brake disc with caliper, LANA SS46',
    image: { src: '/sb-assets/brake-disk.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '7',
    sku: 'SKU-116',
    name: 'PrecisionStop™ 494 Advanced Brake Pad Set',
    image: { src: '/sb-assets/brake-disk.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '8',
    sku: 'SKU-117',
    name: 'UltraGrip™ 122 Performance Brake Pads',
    image: { src: '/sb-assets/brake-pad.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '9',
    sku: 'SKU-118',
    name: 'UltraGrip™ 555 Performance Brake Pads',
    image: { src: '/sb-assets/brake-system.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '10',
    sku: 'SKU-119',
    name: 'UltraGrip™ 555 Performance Brake Pads',
    image: { src: '/sb-assets/brake-disk.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '11',
    sku: 'SKU-120',
    name: 'Brake Pad Set, disc brake DELPHI LP20',
    image: { src: '/sb-assets/brake-system.png', width: 45, height: 45 },
    url: '/',
  },
  {
    id: '12',
    sku: 'SKU-121',
    name: 'Brake disc with caliper, LANA SS46',
    image: { src: '/sb-assets/brake-disk.png', width: 45, height: 45 },
    url: '/',
  },
];

export const quickOrderProducts = [
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
