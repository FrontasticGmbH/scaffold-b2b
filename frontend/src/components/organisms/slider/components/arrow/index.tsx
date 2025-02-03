import React from 'react';
import {
  ChevronDownIcon as DownIcon,
  ChevronLeftIcon as PrevIcon,
  ChevronRightIcon as NextIcon,
  ChevronUpIcon as UpIcon,
} from '@heroicons/react/24/solid';
import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';
import { ArrowProps } from '../../types';

const Arrow = ({
  onClick,
  align = 'horizontal',
  position = 'prev',
  className = '',
  customClassName = '',
  style = {},
  customStyles = {},
  variant = 'default',
  size = 32,
  iconClassName = '',
  overlayDarkArrow = false,
}: ArrowProps) => {
  const arrowVa = cva({
    position: {
      prev: align == 'horizontal' ? 'left-0' : '-top-2',
      next: align == 'horizontal' ? 'right-0' : 'bottom-2',
    },
    align: {
      vertical: 'left-1/2 -translate-x-1/2',
      horizontal: 'top-1/2 -translate-y-1/2',
    },
  });

  const arrowClassName = classnames(
    className,
    customClassName,
    'absolute z-[49] cursor-pointer',
    arrowVa(`align.${align}`) as string,
    arrowVa(`position.${position}`) as string,
    { 'p-4 transition lg:hover:bg-accent-blue': variant === 'overlay' },
  );

  const IconRef = {
    horizontal: {
      prev: PrevIcon,
      next: NextIcon,
    },
    vertical: {
      prev: UpIcon,
      next: DownIcon,
    },
  };

  const Icon = IconRef[align][position];

  return (
    <div className={arrowClassName} style={{ ...style, ...customStyles }} onClick={onClick}>
      <Icon
        width={size}
        height={size}
        className={classnames(iconClassName, 'transition', {
          'text-gray-600 hover:text-gray-800': variant === 'default',
          [overlayDarkArrow ? 'text-gray-800' : 'text-white']: variant === 'overlay',
        })}
      />
    </div>
  );
};

export default Arrow;
