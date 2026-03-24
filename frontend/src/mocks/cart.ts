import { Cart } from '@shared/types/cart/Cart';
import { Transaction } from '@/types/transaction';
import { mapLineItem } from '@/utils/mappers/map-lineitem';
import { Product } from '@/types/entity/product';
import { cartLineItems } from './cartLineItems';

export const cart: Omit<Cart, 'lineItems'> & { lineItems: Product[]; transaction: Transaction } = {
  cartId: '1',
  lineItems: cartLineItems.map(mapLineItem),
  transaction: {
    subtotal: { centAmount: 30000, currencyCode: 'USD', fractionDigits: 2 },
    discount: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
    tax: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
    shipping: { centAmount: 0, currencyCode: 'USD', fractionDigits: 2 },
    total: { centAmount: 30000, currencyCode: 'USD', fractionDigits: 2 },
  },
};
