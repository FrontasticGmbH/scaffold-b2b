import React from 'react';
import { useRouter } from 'next/navigation';
import Link from '@/components/atoms/link';
import { classnames } from '@/utils/classnames/classnames';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { Props } from './types';

const PreviousPageLink = ({ className }: Props) => {
  const router = useRouter();

  const { translate } = useTranslation();

  return (
    <Link
      className={classnames('text-14 leading-normal text-[#274082]', className)}
      href="#"
      onClick={() => router.back()}
    >
      {translate('common.back.to.previous.page')}
    </Link>
  );
};

export default PreviousPageLink;
