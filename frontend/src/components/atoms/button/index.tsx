'use client';

import { FC } from 'react';
import Skeleton from '../skeleton';
import FeedbackIconLayer from './components/feedback-icon-layer';
import useClassNames from './hooks/useClassNames';
import { ButtonProps } from './types';

const Button: FC<ButtonProps> = ({
  icon,
  added,
  loading,
  children,
  className,
  disabled,
  asSkeleton = false,
  variant = 'primary',
  iconPosition = 'right',
  size = children ? 's' : 'icon',
  ...props
}) => {
  const buttonClassName = useClassNames({
    variant,
    size,
    className,
    includesIcon: !!icon && !!children,
    iconPosition,
    loading,
    asSkeleton,
  });

  return (
    <button {...props} className={buttonClassName} disabled={disabled || loading}>
      {(loading || added) && <FeedbackIconLayer loading={loading} variant={variant} />}
      {children}
      {icon}
      {asSkeleton && <Skeleton />}
    </button>
  );
};

export default Button;
