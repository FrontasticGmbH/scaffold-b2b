import { Account } from '@/types/entity/account';
import { Discount } from '@/types/entity/discount';
import { Product } from '@/types/entity/product';
import { PurchaseList } from '@/types/entity/purchase-list';
import { Transaction } from '@/types/transaction';
import { Wishlist } from '@shared/types/wishlist';

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
type ProductWithDeleteAttr = Product & { deleted?: boolean };
export type CartProps = {
  loading?: boolean;
  lineItems: ProductWithDeleteAttr[];
  account: Pick<Account, 'email'>;
  paymentMethods: Array<PaymentMethod>;
  codeApplied?: string;
  viewCartDisabled?: boolean;
  quoteRequestDisabled?: boolean;
  checkoutDisabled?: boolean;
  invalidAddressesRequirements?: boolean;
  discountCodes: Array<Discount & { onRemove?: () => Promise<boolean> }>;
  onAdd: (sku: string, qty: number) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onUpdateQuantity: (id: string, qty: number) => Promise<void>;
  onUndoRemove?: (id: string) => Promise<void>;
  onDiscountRedeem?: (code: string) => Promise<{ success: boolean; message?: string }>;
  onClear?: () => Promise<void>;
  onClearItem?: (id: string) => void;
} & { transaction?: Transaction } & Pick<CartItemProps, 'onAddToNewWishlist'>;

export type CartContentProps = Pick<
  CartProps,
  | 'onUpdateQuantity'
  | 'onRemove'
  | 'onAdd'
  | 'onAddToNewWishlist'
  | 'lineItems'
  | 'loading'
  | 'discountCodes'
  | 'onUndoRemove'
  | 'onClearItem'
> & {
  className?: string;
};

export type CartItemFooterProps = {
  item: Product;
  className?: string;
  isQuotationCart?: boolean;
  showRemoveOnly?: boolean;
  onRemove?: () => Promise<void>;
  onAddToNewWishlist?: (
    list: Pick<PurchaseList, 'name' | 'description' | 'store'>,
    sku?: string,
    qty?: number,
  ) => Promise<Wishlist | null>;
};

export type CartItemHeaderProps = {
  item: Product;
  className?: string;
  showStockAvailability?: boolean;
};

interface ClassNames {
  moveToWishlist?: string;
}

export interface CartItemProps {
  item: Product & { deleted?: boolean };
  discountCodesApplied?: Array<{ name: string; code: string }>;
  classNames?: ClassNames;
  onUpdateQuantity: (qty: number) => Promise<void>;
  onUndoRemove?: () => Promise<void>;
  onRemove?: () => Promise<void>;
  onAddToNewWishlist: (
    list: Pick<PurchaseList, 'name' | 'description' | 'store'>,
    sku?: string,
    qty?: number,
  ) => Promise<Wishlist | null>;
  onClearItem?: (id: string) => void;
}

export type CartItemsListProps = Pick<CartContentProps, 'lineItems' | 'onUndoRemove'> &
  Pick<CartProps, 'onUpdateQuantity' | 'onRemove' | 'onAdd' | 'onAddToNewWishlist' | 'discountCodes' | 'onClearItem'>;
