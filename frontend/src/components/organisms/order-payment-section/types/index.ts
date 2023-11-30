import { Cart } from '@shared/types/cart/Cart';
import { Order } from '@shared/types/cart/Order';
import { Money } from '@shared/types/product/Money';
import { PaymentMethod } from '@/components/organisms/cart/types';

export type CostsLabel = 'subtotal' | 'shipping' | 'tax' | 'discount' | 'total';

export type MappedCosts = {
  [key in CostsLabel]: Money;
};

export type CostsProps = {
  className?: string;
  totalAmountClassName?: string;
  subCostsContainerClassName?: string;
  subCostClassName?: string;
  dataReference?: 'cart' | 'order';
  order?: Order;
  cart?: Cart;
  costs?: MappedCosts;
};

export type CostRef = { key: CostsLabel; label: string; value: Money };

export type CostsValueRef = {
  [key in 'cart' | 'order']: MappedCosts;
};

export type PaymentMethodsProps = {
  paymentMethods: Array<PaymentMethod>;
};

export type DiscountFormProps = {
  className?: string;
};

export type UseCostsData = (props: Pick<CostsProps, 'dataReference' | 'order' | 'cart'>) => {
  costsToRender: CostRef[];
  total: CostRef;
  loading: boolean;
};
