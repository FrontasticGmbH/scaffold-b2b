import React, { useContext } from 'react';
import Link from '@/components/atoms/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { HeaderContext } from '../context';

const AccountLink = () => {
  const { accountLink } = useContext(HeaderContext);
  return (
    <Link href={accountLink.href ?? '/'}>
      <UserCircleIcon className="w-7 text-gray-700 lg:w-5" />
    </Link>
  );
};

export default AccountLink;
