import { Option } from '@/components/atoms/select/types';
import { Currency } from '@/types/currency';
import { Address } from '@/types/entity/address';
import { Discount } from '@/types/entity/discount';
import { Product } from '@/types/entity/product';
import { ShippingMethod } from '@/types/entity/shipping-method';
import { Link } from '@/types/link';

interface InitialData {
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingMethodId?: string;
  paymentMethodId?: string;
}

interface Transaction {
  subtotal: number;
  discounts: number;
  shipping: {
    isEstimated: boolean;
    amount: number;
  };
  taxes: number;
  total: number;
  currency: Currency;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  image: {
    src: string;
    className: string;
  };
}

export interface CheckoutProps {
  addresses: Address[];
  onAddAddress?: (address: Address) => Promise<boolean>;
  products: Array<Pick<Product, 'id' | 'name' | 'currency' | 'price' | 'quantity' | 'images'>>;
  transaction: Transaction;
  discounts: Array<Discount & { onRemove?: () => Promise<boolean> }>;
  onApplyDiscount?: (code: string) => Promise<boolean>;
  countryOptions: Array<Option & { states: Array<Option> }>;
  onCompleteAddresses?: (shippingAddress: Address, billingAddress: Address) => Promise<boolean>;
  termsAndConditionsLink?: Link;
  initialData: InitialData;
  shippingMethods: ShippingMethod[];
  onCompleteShipping?: (shippingMethodId: string) => Promise<boolean>;
  paymentMethods: PaymentMethod[];
  onCompletePayment?: (paymentMethodId: string, data: unknown) => Promise<boolean>;
  onSubmitPurchase: () => Promise<boolean>;
}
