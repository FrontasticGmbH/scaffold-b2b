import { Quote } from '@/types/entity/quote';

export const quote: Quote = {
  id: '1',
  author: 'Mina',
  creationDate: '06/03/2024',
  lastModifiedDate: '06/03/2024',
  businessUnit: 'Business Unit',
  status: 'accepted',
  activity: [
    {
      title: 'Quote created',
      date: '06/03/2024',
    },
    {
      title: 'Quote accepted',
      date: '06/03/2024',
    },
  ],
  subtotal: 100,
  total: 100,
  currency: 'USD',
  items: [
    {
      id: '1',
      name: 'Item 1',
      price: 50,
      currency: 'USD',
      quantity: 2,
      images: ['https://cdn.com/sb-assets/brake-disk.png'],
    },
  ],
  shippingCosts: 0,
  discount: 0,
  taxCosts: 0,
  isNew: false,
  shippingAddress: '17 street, 1234, City, Country',
  billingAddress: '17 street, 1234, City, Country',
  shippingMethod: 'Standard Shipping',
  paymentMethod: 'Visa',
};
