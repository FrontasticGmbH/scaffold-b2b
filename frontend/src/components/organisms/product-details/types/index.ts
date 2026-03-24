import { PropsWithChildren } from 'react';
import { Attribute, Product } from '@/types/entity/product';
import { Wishlist as SharedWishlist } from '@shared/types/wishlist/Wishlist';

export type Wishlist = {
  label: string;
  id: string;
  lineItemId?: string;
  productIsInWishlist?: boolean;
};

export type WishlistToastProps = {
  wishlist: Wishlist;
};

export type ColoredVariantProps = {
  className?: string;
  color: string;
  active?: boolean;
  onClick?: () => void;
};

export type ColorVariantsProps = {
  colors: Required<Product>['colors'];
  currentColor: Attribute;
  onChangeColor: (value: string) => void;
};

export type SpecsVariantsProps = {
  specs: Required<Product>['specs'];
  currentSpecs: Attribute;
  onChangeSpecs: (value: string) => void;
};

export type ShoppingListCTAProps = {
  getWishlists: () => Promise<Array<Wishlist> | undefined>;
  addToWishlists: (wishlistIds: string[], count?: number) => Promise<Wishlist[]>;
  removeFromWishlists: (wishlists: { wishlistId: string; lineItemId: string }[]) => Promise<Wishlist[]>;
  addToNewWishlist: (
    list: Pick<SharedWishlist, 'name' | 'description' | 'store'>,
    count?: number,
  ) => Promise<SharedWishlist | null>;
};

export type ShippingMethod = {
  label: string;
  description: string;
  price: number;
  estimatedDeliveryDays: number;
};

export type ShippingMethodProps = ShippingMethod & {
  className?: string;
  currency: Product['currency'];
};

export type ShippingProps = {
  shippingMethods: ShippingMethod[];
  currency: Product['currency'];
};

export type CartCTAProps = {
  product: Product;
  addToCartDisabled?: boolean;
  addToCart: (count: number) => Promise<void>;
  countChange: (count: number) => void;
};

export type PDPMainInfoProps = Omit<CartCTAProps, 'countChange'> &
  Omit<ShippingProps, 'currency'> &
  ShoppingListCTAProps &
  Partial<Pick<ColorVariantsProps, 'currentColor'>> &
  Partial<Pick<SpecsVariantsProps, 'currentSpecs'>> & {
    product: Product;
    className?: string;
    onChangeVariant: (variant: 'color' | 'model', value: string) => void;
  };

export type PDPHeaderProps = {
  product: Product;
  className?: string;
};

export type AdditionalInfoItemProps = PropsWithChildren<{
  className?: string;
  title: string;
}>;

export type AdditionalInfoProps = Pick<Product, 'description' | 'specifications'> & {
  className?: string;
};

export type ProductDetailsProps = Omit<AdditionalInfoProps, 'className'> &
  Omit<PDPMainInfoProps, 'className'> &
  Omit<PDPHeaderProps, 'className'> & {
    product: Product;
  };
