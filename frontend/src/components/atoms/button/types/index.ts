import { ComponentProps, ReactElement } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'underlined' | 'ghost' | 'warning';
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'fit' | 'full' | 'icon';
export type ButtonIconPosition = 'left' | 'right';

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconPosition?: ButtonIconPosition;
  icon?: ReactElement;
  loading?: boolean;
  added?: boolean;
  asSkeleton?: boolean;
}

type IconProps = { includesIcon: boolean; iconPosition: ButtonProps['iconPosition'] };
export type UseClassNames = (
  props: Pick<ButtonProps, 'variant' | 'size' | 'className' | 'loading' | 'asSkeleton'> & IconProps,
) => string;
