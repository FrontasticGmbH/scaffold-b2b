'use client';

import { FC } from 'react';
import Skeleton from '../skeleton';
import FeedbackIconLayer from './components/feedback-icon-layer';
import useClassNames from './hooks/useClassNames';
import { ButtonProps } from './types';

const Button: FC<ButtonProps> = ({
  Icon,
  added,
  loading,
  children,
  className,
  disabled,
  asSkeleton = false,
  iconPosition = 'right',
  variant = 'primary',
  size = variant === 'underlined' ? 'fit' : 's',
  ...props
}) => {
  const { buttonClassName, iconClassName } = useClassNames({
    variant,
    size,
    className,
    includesIcon: !!Icon && !!children,
    isIconOnly: !!Icon && !children,
    iconPosition,
    loading,
    asSkeleton,
  });

  return (
    <button {...props} className={buttonClassName} disabled={disabled || loading}>
      {(loading || added) && <FeedbackIconLayer loading={loading} variant={variant} />}
      {children}
      {Icon && <Icon className={iconClassName} />}
      {asSkeleton && <Skeleton data-testid="skeleton" />}
    </button>
  );
};

export default Button;
