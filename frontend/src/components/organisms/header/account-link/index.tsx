import React, { useContext } from 'react';
import Link from '@/components/atoms/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { HeaderContext } from '../context';

const AccountLink = () => {
  const { translate } = useTranslation();
  const { accountLink } = useContext(HeaderContext);
  return (
    <Link aria-label={translate('account.my.account')} href={accountLink.href ?? '/'}>
      <UserCircleIcon className="w-6 text-gray-700 lg:w-5" />
    </Link>
  );
};

export default AccountLink;
