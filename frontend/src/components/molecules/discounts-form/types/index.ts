import { Discount } from '@/types/entity/discount';

export type DiscountFormProps = {
  className?: string;
  discounts: Array<Discount & { onRemove?: () => Promise<boolean> }>;
  onSubmit?: (code: string) => Promise<{ success: boolean; message?: string }>;
  customError?: string;
  onExpanded?: () => void;
  onCollapsed?: () => void;
  codeApplied?: string;
};
