import { LineItem } from '@shared/types/cart/LineItem';

export const cartLineItems: LineItem[] = [
  {
    lineItemId: '2234-3333-0001',
    count: 3,
    name: 'Item number 1',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },
    variant: {
      id: '1',
      sku: 'GRCG-01',
      images: ['/sb-assets/brake-disk.png'],
      attributes: {
        model: 'model a-1',
        productspec: '- Set of 5 glasses\n- Imported crystal\n- Gold polish on the rims',
      },
      price: {
        fractionDigits: 2,
        centAmount: 2799,
        currencyCode: 'GBP',
      },
    },
  },
  {
    lineItemId: '2234-3333-0002',
    count: 3,
    name: 'Item number 2',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },

    variant: {
      id: '1',
      sku: 'GPC-01',
      images: ['/sb-assets/brake-disk.png'],
      attributes: {
        model: 'model a-1',
        color: 'silver',
        colorlabel: 'Silver',
        productspec:
          '- Velvet fabric\n- Cotton lining\n- Pillow case comes with zip for easy removal\n- Pillow not included\n- Washable',
      },
      price: {
        fractionDigits: 2,
        centAmount: 1999,
        currencyCode: 'GBP',
      },
      isOnStock: true,
    },
  },
  {
    lineItemId: '2234-3333-0003',
    count: 3,
    name: 'Item number 3',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },

    variant: {
      id: '1',
      sku: 'TTSS-01',
      images: ['/sb-assets/brake-disk.png'],
      attributes: {
        model: 'model a-1',
        productspec: '- Three seater sofa\n- Velvet upholstery\n- Assembly on site',
        color: '#09331c',
        colorlabel: 'Emerald',
        finish: '#202120',
        finishlabel: 'Espresso',
      },
      price: {
        fractionDigits: 2,
        centAmount: 239900,
        currencyCode: 'GBP',
      },
      discountedPrice: {
        value: {
          fractionDigits: 2,
          centAmount: 215910,
          currencyCode: 'GBP',
        },
      },
      isOnStock: true,
    },
  },
  {
    lineItemId: '2234-3333-0004',
    count: 3,
    name: 'Item number 4',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },

    variant: {
      id: '1',
      sku: 'ALC-01',
      images: ['/sb-assets/brake-disk.png'],
      attributes: {
        model: 'model a-1',
        color: 'lightpink',
        colorlabel: 'Soft Pink',
        finishlabel: 'Brass',
        finish: 'goldenrod',
        productspec: '- Comes with matching throw pillow\n- Velvet upholstery\n- Pre-assembled',
      },
      price: {
        fractionDigits: 2,
        centAmount: 75000,
        currencyCode: 'GBP',
      },
      isOnStock: true,
    },
  },
  {
    lineItemId: '2234-3333-0005',
    count: 3,
    name: 'Item number 5',
    price: {
      centAmount: 9999,
      currencyCode: 'EUR',
      fractionDigits: 2,
    },

    variant: {
      id: '1',
      sku: 'MMST-01',
      images: ['/sb-assets/brake-disk.png'],
      attributes: {
        model: 'model a-1',
        color: 'white',
        colorlabel: 'White',
        finish: 'white',
        finishlabel: 'Marble',
        productspec: '- 4 legged side table\n- Walnut legs\n- Pre-assembled',
      },
      price: {
        fractionDigits: 2,
        centAmount: 12000,
        currencyCode: 'GBP',
      },
      isOnStock: true,
    },
  },
];
