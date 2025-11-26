import { Cart } from '@shared/types/cart/Cart';
import { Transaction } from '@/types/transaction';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { Product } from '@/types/entity/product';
import { cartLineItems } from './cartLineItems';
import type { LineItem } from '@shared/types/cart/LineItem';
import type { Discount } from '@/types/entity/discount';

export const cart: Omit<Cart, 'lineItems'> & { lineItems: Product[]; transaction: Transaction } = {
  cartId: '1',
  lineItems: cartLineItems.map((item) => mapLineItem(item)),
  transaction: {
    subtotal: { centAmount: 30000, currencyCode: 'USD', fractionDigits: 2 },
    discount: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2, segments: [] },
    tax: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
    shipping: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
    total: { centAmount: 30000, currencyCode: 'USD', fractionDigits: 2 },
  },
};

// Helpers (kept local to mocks)
const money = (centAmount: number, currencyCode: string = 'USD') => ({
  fractionDigits: 2 as const,
  centAmount,
  currencyCode,
});

// Scenario 1: Line-item discounts (absolute and relative)
const lineItemDiscountsItems: LineItem[] = [
  {
    lineItemId: 'li-abs-1',
    name: 'Pneumatic Tire',
    count: 2,
    price: money(50000),
    discountedPrice: {
      value: money(49500),
      discount: {
        name: '5 USD off on spare parts',
        description: 'Absolute discount example',
        discountValue: {
          type: 'absolute',
          value: { ...money(500) },
        },
      },
    },
    totalPrice: money(99000),
    taxed: {
      netAmount: money(99000),
      grossAmount: money(102960),
      taxAmount: money(3960),
    },
    taxRate: {
      taxRateId: 'tx-ny',
      taxRateKey: 'ny-state-tax',
      name: 'State Tax: New York',
      amount: 0.04,
      includedInPrice: false,
      country: 'US',
      state: 'NY',
    },
    variant: {
      id: '1',
      sku: 'pneumatic-tire',
      images: ['https://storage.googleapis.com/merchant-center-europe/sample-data/b2bstore/pneumatic-tire.webp'],
      attributes: {},
      isOnStock: true,
      availableQuantity: 908,
    },
    isGift: false,
    _url: '/pneumatic-tire/p/pneumatic-tire',
  },
  {
    lineItemId: 'li-rel-1',
    name: 'X234 WX Off-Highway Dump Truck',
    count: 2,
    price: money(2640000),
    discountedPrice: {
      value: money(2244000),
      discount: {
        name: '15% off on all dump trucks',
        description: 'Save 15% off instantly',
        discountValue: { type: 'relative', value: 1500 },
      },
    },
    totalPrice: money(4488000),
    taxed: {
      netAmount: money(4488000),
      grossAmount: money(4667520),
      taxAmount: money(179520),
    },
    taxRate: {
      taxRateId: 'tx-ny',
      taxRateKey: 'ny-state-tax',
      name: 'State Tax: New York',
      amount: 0.04,
      includedInPrice: false,
      country: 'US',
      state: 'NY',
    },
    variant: {
      id: '1',
      sku: 'x234-wx-2015',
      images: ['https://storage.googleapis.com/merchant-center-europe/sample-data/b2bstore/x234-wx-2015.webp'],
      attributes: {},
      isOnStock: true,
      availableQuantity: 882,
    },
    isGift: false,
    _url: '/x234-wx/p/x234-wx-2015',
  },
];

export const cartWithLineItemDiscounts: typeof cart = {
  ...cart,
  lineItems: lineItemDiscountsItems.map((li) => mapLineItem(li)),
  transaction: {
    subtotal: money(5380000),
    discount: {
      ...money(793000),
      fractionDigits: 2,
      segments: [
        {
          source: 'Pneumatic Tire',
          label: 'cart.lineItemDiscount',
          discountedAmount: 1000,
          value: { type: 'absolute', value: 500 },
        },
        {
          source: 'X234 WX Off-Highway Dump Truck',
          label: 'cart.lineItemDiscount',
          discountedAmount: 792000,
          value: { type: 'relative', value: 1500 },
        },
      ],
    },
    tax: money(0),
    shipping: money(0),
    total: money(4587000),
  } as Transaction,
};

// Scenario 2: Per-count discounts and a gift line item
const towerCrane: LineItem = {
  lineItemId: 'li-bogo-1',
  name: 'SS123 QR Tower Crane',
  count: 3,
  price: money(4620000),
  discountedPricePerCount: [
    {
      count: 1,
      discountedPrice: {
        value: money(0),
        includedDiscounts: [
          {
            discountedAmount: money(2000),
            discount: {
              cartDiscountId: 'disc-abs-2000',
              name: 'Buy One get discount on Second',
              description: 'Absolute 20.00 discount on second item',
              discountValue: {
                type: 'absolute',
                value: { ...money(2000) },
              },
              cartPredicate: '1 = 1',
              target: { type: 'pattern', selectionMode: 'Cheapest' } as any,
            },
          },
          {
            discountedAmount: money(4618000),
            discount: {
              cartDiscountId: 'disc-bogo-100',
              name: 'Buy One, Get One Free',
              description: 'Two for one (discount on the cheapest item)',
              discountValue: { type: 'relative', value: 10000 },
              cartPredicate: '1 = 1',
              target: { type: 'pattern', selectionMode: 'Cheapest' } as any,
            },
          },
        ],
      },
    },
    { count: 2, discountedPrice: { value: money(4620000), includedDiscounts: [] } },
  ],
  totalPrice: money(9240000),
  taxed: {
    netAmount: money(9240000),
    grossAmount: money(9609600),
    taxAmount: money(369600),
  },
  taxRate: {
    taxRateId: 'tx-ny',
    taxRateKey: 'ny-state-tax',
    name: 'State Tax: New York',
    amount: 0.04,
    includedInPrice: false,
    country: 'US',
    state: 'NY',
  },
  variant: {
    id: '1',
    sku: 'ss123-qr-red',
    images: ['https://storage.googleapis.com/merchant-center-europe/sample-data/b2bstore/ss123-qr-red.webp'],
    attributes: {},
    isOnStock: true,
    availableQuantity: 905,
  },
  isGift: false,
  _url: '/ss123-qr/p/ss123-qr-red',
};

const giftDozer: LineItem = {
  lineItemId: 'li-gift-1',
  name: 'I789 UV Waste Handling Bulldozer',
  count: 1,
  price: money(1848000),
  discountedPricePerCount: [
    {
      count: 1,
      discountedPrice: {
        value: money(0),
        includedDiscounts: [
          {
            discountedAmount: money(1848000),
            discount: {
              cartDiscountId: 'disc-gift-1',
              name: 'Buy 2 dump trucks and get one free',
              description: 'Gift line item',
              discountValue: { type: 'giftLineItem', productId: 'f715dd9e', variantId: '1' } as any,
              cartPredicate: 'lineItemCount >= 2',
            },
          },
        ],
      },
    },
  ],
  totalPrice: money(0),
  taxed: { netAmount: money(0), grossAmount: money(0), taxAmount: money(0) },
  taxRate: {
    taxRateId: 'tx-ny',
    taxRateKey: 'ny-state-tax',
    name: 'State Tax: New York',
    amount: 0.04,
    includedInPrice: false,
    country: 'US',
    state: 'NY',
  },
  variant: {
    id: '1',
    sku: 'i789-uv-2015',
    images: ['https://storage.googleapis.com/merchant-center-europe/sample-data/b2bstore/i789-uv-2015.webp'],
    attributes: {},
    isOnStock: true,
    availableQuantity: 646,
  },
  isGift: true,
  _url: '/i789-uv/p/i789-uv-2015',
};

export const cartWithPerCountDiscountsAndGift: typeof cart = {
  ...cart,
  lineItems: [towerCrane, giftDozer].map((li) => mapLineItem(li)),
  transaction: {
    subtotal: money(15708000),
    discount: {
      ...money(6468000),
      fractionDigits: 2,
      segments: [
        {
          label: 'Buy One get discount on Second',
          discountedAmount: 2000,
          value: { type: 'absolute', value: 2000 },
        },
        {
          label: 'Buy One, Get One Free',
          discountedAmount: 4618000,
          value: { type: 'relative', value: 10000 },
        },
        {
          label: 'Buy 2 dump trucks and get one free',
          discountedAmount: 1848000,
          value: { type: 'giftLineItem', value: 100 },
        },
      ],
    },
    tax: money(0),
    shipping: money(0),
    total: money(9240000),
  } as Transaction,
};

// Scenario 3: Cart-level discount code (20% off total)
export const discountCodes20OFF: Array<Discount> = [
  { discountCodeId: 'dc-20off', name: '20% off cart', code: '20OFF' },
];

export const transactionWith20OFF: Transaction = {
  subtotal: cart.transaction.subtotal,
  discount: {
    ...cart.transaction.discount,
    centAmount: Math.round(cart.transaction.subtotal.centAmount * 0.2),
    segments: [
      {
        label: 'Code 20OFF',
        value: { type: 'relative', value: 2000 },
        discountedAmount: Math.round(cart.transaction.subtotal.centAmount * 0.2),
        targetsTotal: true,
      },
    ],
  },
  tax: cart.transaction.tax,
  shipping: cart.transaction.shipping,
  total: {
    ...cart.transaction.total,
    centAmount: cart.transaction.subtotal.centAmount - Math.round(cart.transaction.subtotal.centAmount * 0.2),
  },
};
