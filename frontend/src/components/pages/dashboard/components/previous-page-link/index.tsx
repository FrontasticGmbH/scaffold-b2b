import React from 'react';
import { useRouter } from 'next/navigation';
import Link from '@/components/atoms/link';
import { classnames } from '@/utils/classnames/classnames';
import { useTranslations } from 'use-intl';
import { Props } from './types';

const PreviousPageLink = ({ className }: Props) => {
  const router = useRouter();

  const translate = useTranslations();

  return (
    <Link
      className={classnames('text-14 leading-normal text-blue-700', className)}
      href="#"
      onClick={() => router.back()}
    >
      {translate('common.back-to-previous-page')}
    </Link>
  );
};

export default PreviousPageLink;
