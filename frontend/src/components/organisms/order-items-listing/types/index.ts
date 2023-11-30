import { LineItem } from '@shared/types/cart/LineItem';

export type OrderItemsListingProps = {
  className?: string;
  lineItems: LineItem[];
};

export type ClosedButtonProps = {
  hiddenItemsCount: number;
  lineItems: LineItem[];
  open: boolean;
  onClick: () => void;
};

export type OrderItemProps = {
  lineItem: LineItem;
};

export type OrderItemsListProps = {
  className?: string;
  lineItems: LineItem[];
};
