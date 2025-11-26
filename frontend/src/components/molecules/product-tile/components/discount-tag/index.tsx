import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { useTranslations } from 'use-intl';
import { Props } from './types';

const DiscountTag = ({ discountName, className }: Props) => {
  const translate = useTranslations();

  if (!discountName) return null;

  return (
    <div
      className={classnames(
        'bg-red-500 px-2 py-1 text-center text-12 font-medium leading-normal text-white',
        className,
      )}
    >
      {discountName}
    </div>
  );
};

export default DiscountTag;
