import React, { useContext } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import { useTranslations } from 'use-intl';
import { HeaderContext } from '../context';

const CartLink = () => {
  const translate = useTranslations();
  const { cartLink, cartItems } = useContext(HeaderContext);
  return (
    <Link href={cartLink.href ?? '/'} className="relative flex items-center justify-center p-1">
      {cartItems > 0 && (
        <p className="absolute -right-2 top-[-14px] rounded-full bg-primary px-[5px] py-[2px] text-10 text-white lg:right-[-12px]">
          {cartItems.toString()}
        </p>
      )}
      <p className="hidden text-16 text-gray-700 lg:block">{translate('common.cart')}</p>
      <ShoppingCartIcon className="ml-0 w-6 text-gray-700 lg:ml-2 lg:w-5" />
    </Link>
  );
};
export default CartLink;
