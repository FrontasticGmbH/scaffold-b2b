import { Account } from '@/types/entity/account';
import { Quote } from '@/types/entity/quote';
import { Transaction } from '@/types/transaction';
import { Cart } from '@shared/types/cart/Cart';
import { LineItem } from '@shared/types/cart/LineItem';

export type PaymentMethodType =
  | 'scheme'
  | 'klarna'
  | 'klarna_account'
  | 'klarna_paynow'
  | 'paysafecard'
  | 'swish'
  | 'trustly'
  | 'vipps'
  | 'multibanco'
  | 'ideal';

export interface PaymentMethod {
  name: string;
  type: PaymentMethodType;
  image: {
    src: string;
  };
}

export type CartProps = {
  account: Pick<Account, 'email'>;
  paymentMethods: Array<PaymentMethod>;
  onRemove: (id: string) => Promise<void>;
  onUpdateQuantity: (id: string, qty: number) => Promise<void>;
  onRequestQuote: (args: { buyerComment?: string }) => Promise<Partial<Quote>>;
} & Cart & { transaction: Transaction };

export type CartContentProps = Pick<Cart, 'lineItems'> &
  Pick<CartProps, 'onUpdateQuantity' | 'onRemove'> & {
    className?: string;
  };

export type CartItemFooterProps = Pick<CartItemProps, 'onRemove'> & {
  className?: string;
};

export type CartItemHeaderProps = {
  item: LineItem;
  className?: string;
};

interface ClassNames {
  moveToWishlist?: string;
}

export interface CartItemProps {
  item: LineItem;
  classNames?: ClassNames;
  onUpdateQuantity: (qty: number) => Promise<void>;
  onRemove?: () => Promise<void>;
}

export type CartItemsListProps = Pick<CartContentProps, 'lineItems'> & Pick<CartProps, 'onUpdateQuantity' | 'onRemove'>;
