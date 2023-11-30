import React from 'react';
import { ChevronRightIcon as NextIcon, ChevronLeftIcon as PrevIcon } from '@heroicons/react/24/solid';
import { classnames } from '@/utils/classnames/classnames';
import { cva } from '@/utils/classnames/cva';
import { ArrowProps } from '../../types';

const Arrow = ({
  onClick,
  position,
  className = '',
  customClassName = '',
  style = {},
  customStyles = {},
  variant = 'default',
  size = 32,
}: ArrowProps) => {
  const arrowPosition = cva({
    position: {
      prev: 'left-0',
      next: 'right-0',
    },
  });

  const arrowClassName = classnames(
    className,
    customClassName,
    'absolute top-1/2 z-50 -translate-y-1/2 cursor-pointer',
    arrowPosition(`position.${position}`) as string,
    { 'p-4 transition lg:hover:bg-[#778DA9]': variant === 'overlay' },
  );

  const Icon = position === 'prev' ? PrevIcon : NextIcon;

  return (
    <div className={arrowClassName} style={{ ...style, ...customStyles }} onClick={onClick}>
      <Icon
        width={size}
        height={size}
        className={classnames('transition', {
          'text-gray-600 hover:text-gray-800': variant === 'default',
          'text-white': variant === 'overlay',
        })}
      />
    </div>
  );
};

export default Arrow;
