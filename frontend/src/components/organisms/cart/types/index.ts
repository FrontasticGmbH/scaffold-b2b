import { Account } from '@/types/entity/account';
import { Discount } from '@/types/entity/discount';
import { Product } from '@/types/entity/product';
import { PurchaseList } from '@/types/entity/purchase-list';
import { Transaction } from '@/types/transaction';

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
  loading?: boolean;
  lineItems: Product[];
  account: Pick<Account, 'email'>;
  paymentMethods: Array<PaymentMethod>;
  viewCartDisabled?: boolean;
  quoteRequestDisabled?: boolean;
  checkoutDisabled?: boolean;
  invalidAddressesRequirements?: boolean;
  discountCodes: Array<Discount & { onRemove?: () => Promise<boolean> }>;
  onAdd: (sku: string, qty: number) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onUpdateQuantity: (id: string, qty: number) => Promise<void>;
  onDiscountRedeem?: (code: string) => Promise<boolean>;
  onClear?: () => Promise<void>;
} & { transaction?: Transaction } & Pick<CartItemProps, 'onAddToNewWishlist'>;

export type CartContentProps = Pick<
  CartProps,
  'onUpdateQuantity' | 'onRemove' | 'onAdd' | 'onAddToNewWishlist' | 'lineItems' | 'loading'
> & {
  className?: string;
};

export type CartItemFooterProps = Pick<CartItemProps, 'onRemove' | 'onAddToNewWishlist'> & {
  item: Product;
  className?: string;
  isQuotationCart?: boolean;
};

export type CartItemHeaderProps = {
  item: Product;
  className?: string;
};

interface ClassNames {
  moveToWishlist?: string;
}

export interface CartItemProps {
  item: Product & { deleted?: boolean };
  classNames?: ClassNames;
  onUpdateQuantity: (qty: number) => Promise<void>;
  onUndoRemove?: () => Promise<void>;
  onRemove?: () => Promise<void>;
  onAddToNewWishlist: (
    list: Pick<PurchaseList, 'name' | 'description' | 'store'>,
    sku?: string,
    qty?: number,
  ) => Promise<void>;
}

export type CartItemsListProps = Pick<CartContentProps, 'lineItems'> &
  Pick<CartProps, 'onUpdateQuantity' | 'onRemove' | 'onAdd' | 'onAddToNewWishlist'>;
