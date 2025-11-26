import { Option } from '@/components/atoms/select/types';
import { Currency } from '@/types/currency';
import { Address } from '@/types/entity/address';
import { Discount } from '@/types/entity/discount';
import { Product } from '@/types/entity/product';
import { ShippingMethod } from '@/types/entity/shipping-method';
import { Link } from '@/types/link';
import { DiscountSegment } from '@/types/transaction';

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
    shippingIncludesTaxes?: boolean;
    amount?: number;
    freeAbove?: number;
  };
  taxes?: number;
  total: number;
  currency: Currency;
  discountSegments: DiscountSegment[];
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

export interface SubmitPurchasePayload {
  buyerComment: string;
}

export interface ShippingDiscount {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage?: number;
}

export interface CheckoutProps {
  includeTotalAmountInSummary?: boolean;
  buyerCanAddComment?: boolean;
  enableCtCheckout?: boolean;
  addresses: Address[];
  onAddAddress?: (address: Address) => Promise<boolean>;
  products: Array<Pick<Product, 'id' | 'name' | 'currency' | 'price' | 'quantity' | 'images' | 'url' | 'isGift'>>;
  transaction: Transaction;
  discounts: Array<Discount & { onRemove?: () => Promise<boolean> }>;
  onApplyDiscount?: (code: string) => Promise<{ success: boolean; message?: string }>;
  countryOptions: Array<Option & { states: Array<Option> }>;
  onCompleteAddresses?: (shippingAddress: Address, billingAddress: Address) => Promise<boolean>;
  termsAndConditionsLink?: Link;
  initialData: InitialData;
  shippingMethods: ShippingMethod[];
  shippingDiscount?: ShippingDiscount;
  onCompleteShipping?: (shippingMethodId: string) => Promise<boolean>;
  paymentMethods: PaymentMethod[];
  onCompletePayment?: (paymentMethodId: string, data: unknown) => Promise<boolean>;
  onSubmitPurchase: (paylaod: SubmitPurchasePayload) => Promise<boolean>;
  translations?: {
    header?: string;
    orderSummaryTitle?: string;
    orderSummarySubtitle?: string;
    purchase?: string;
    review?: string;
  };
  callbackUrl?: string;
  codeApplied?: string;
}
