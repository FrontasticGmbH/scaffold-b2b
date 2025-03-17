import React, { useContext } from 'react';
import Link from '@/components/atoms/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import { HeaderContext } from '../context';

const AccountLink = () => {
  const translate = useTranslations();
  const { accountLink } = useContext(HeaderContext);
  return (
    <Link aria-label={translate('account.my-account')} href={accountLink.href ?? '/'}>
      <UserCircleIcon className="w-8 p-1 text-gray-700 lg:w-5" />
    </Link>
  );
};

export default AccountLink;
