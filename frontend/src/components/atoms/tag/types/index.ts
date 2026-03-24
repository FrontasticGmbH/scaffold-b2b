export type Variant = 'primary' | 'secondary' | 'warning' | 'danger' | 'success';

export interface TagProps {
  variant: Variant;
  className?: string;
}
