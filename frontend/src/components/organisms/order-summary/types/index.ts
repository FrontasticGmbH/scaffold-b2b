import { ReactElement } from 'react';
import { Order } from '@shared/types/cart/Order';
import { Cart } from '@shared/types/cart/Cart';
import { Money } from '@shared/types/product/Money';
import { PaymentMethod } from '@/components/organisms/cart/types';
import { Transaction } from '@/types/transaction';
import { Discount } from '@/types/entity/discount';

export type CheckoutCTAProps = {
  className?: string;
  link: string;
  quoteCheckoutLink: string;
  disabled?: boolean;
  text: string;
  quoteRequestDisabled?: boolean;
  checkoutDisabled?: boolean;
  onCheckout?: () => void;
  onRequestQuote?: () => void;
  onClear?: () => Promise<void>;
};

export interface ClassNames {
  button?: string;
  applyDiscountButton?: string;
  itemsList?: string;
  infoContainer?: string;
  totalAmount?: string;
  subCost?: string;
  subCostsContainer?: string;
}

export type OrderSummaryProps = {
  title?: string;
  className?: string;
  classNames?: ClassNames;
  cart?: Cart;
  order?: Order;
  includeItemsList?: boolean;
  includeSummaryAccordion?: boolean;
  paymentMethods?: Array<PaymentMethod>;
  dataReference?: 'order' | 'cart';
  button?: ReactElement;
  transaction?: Transaction;
  discounts?: Array<Discount & { onRemove?: () => Promise<boolean> }>;
  onDiscountRedeem?: (code: string) => Promise<boolean>;
};

export type SummaryAccordionProps = {
  className?: string;
  order?: Order;
  cart?: Cart;
  transaction?: Transaction;
};

export type AccordionButtonProps = {
  open: boolean;
  toggleAccordion: () => void;
  total: Required<Money>;
};
