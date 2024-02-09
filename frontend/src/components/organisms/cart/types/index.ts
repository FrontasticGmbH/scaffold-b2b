import { Account } from '@/types/entity/account';
import { Quote } from '@/types/entity/quote';
import { Transaction } from '@/types/transaction';
import { Cart } from '@shared/types/cart/Cart';
import { LineItem } from '@shared/types/cart/LineItem';
import { Wishlist as SharedWishlist } from '@shared/types/wishlist';

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
  isQuotationCart?: boolean;
  onAdd: (sku: string, qty: number) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onUpdateQuantity: (id: string, qty: number) => Promise<void>;
  onRequestQuote: (args: { buyerComment?: string }) => Promise<Partial<Quote>>;
  onClear?: () => Promise<void>;
} & Partial<Cart> & { transaction?: Transaction } & Pick<CartItemProps, 'onAddToNewWishlist'>;

export type CartContentProps = Pick<Cart, 'lineItems'> &
  Pick<CartProps, 'onUpdateQuantity' | 'onRemove' | 'onAdd' | 'onAddToNewWishlist' | 'isQuotationCart'> & {
    className?: string;
  };

export type CartItemFooterProps = Pick<CartItemProps, 'onRemove' | 'onAddToNewWishlist'> & {
  item: LineItem;
  className?: string;
  isQuotationCart?: boolean;
};

export type CartItemHeaderProps = {
  item: LineItem;
  className?: string;
};

interface ClassNames {
  moveToWishlist?: string;
}

export interface CartItemProps {
  item: LineItem & { deleted?: boolean };
  classNames?: ClassNames;
  isQuotationCart?: boolean;
  onUpdateQuantity: (qty: number) => Promise<void>;
  onUndoRemove?: () => Promise<void>;
  onRemove?: () => Promise<void>;
  onAddToNewWishlist: (
    list: Pick<SharedWishlist, 'name' | 'description' | 'store'>,
    sku?: string,
    qty?: number,
  ) => Promise<void>;
}

export type CartItemsListProps = Pick<CartContentProps, 'lineItems'> &
  Pick<CartProps, 'onUpdateQuantity' | 'onRemove' | 'onAdd' | 'onAddToNewWishlist' | 'isQuotationCart'>;
