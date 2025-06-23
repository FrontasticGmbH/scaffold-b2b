export type Variant = 'primary' | 'light' | 'secondary' | 'warning' | 'danger' | 'success';

export interface TagProps {
  variant: Variant;
  className?: string;
}
