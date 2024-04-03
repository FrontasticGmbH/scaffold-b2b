import { CheckoutProps } from '@/components/organisms/checkout/types';

export const checkout: CheckoutProps = {
  addresses: [],
  transaction: {
    currency: 'USD',
    subtotal: 100,
    discounts: 0,
    taxes: 0,
    total: 100,
    shipping: {
      isEstimated: false,
      amount: 0,
    },
  },
  products: [
    {
      id: '1',
      name: 'Product 1',
      currency: 'USD',
      price: 100,
      quantity: 1,
      images: ['/sb-assets/bearing.png'],
    },
  ],
  discounts: [],
  onAddAddress: async () => true,
  onApplyDiscount: async () => true,
  onCompleteAddresses: async () => true,
  onCompleteShipping: async () => true,
  onCompletePayment: async () => true,
  onSubmitPurchase: async () => true,
  countryOptions: [
    {
      name: 'Sweden',
      value: 'SE',
      states: [],
    },
  ],
  initialData: {},
  shippingMethods: [],
  paymentMethods: [],
};
