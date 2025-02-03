import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'underlined' | 'ghost' | 'warning';
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'fit' | 'full';
export type ButtonIconPosition = 'left' | 'right';

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconPosition?: ButtonIconPosition;
  Icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  loading?: boolean;
  added?: boolean;
  asSkeleton?: boolean;
}

type IconProps = { includesIcon: boolean; iconPosition: ButtonProps['iconPosition']; isIconOnly?: boolean };

export type UseClassNamesProps = Pick<ButtonProps, 'variant' | 'size' | 'className' | 'loading' | 'asSkeleton'> &
  IconProps;
