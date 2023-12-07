import React, { useContext } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Typography from '@/components/atoms/typography';
import Link from '@/components/atoms/link';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { HeaderContext } from '../context';

const CartLink = () => {
  const { translate } = useTranslation();
  const { cartLink, cartItems } = useContext(HeaderContext);
  return (
    <Link href={cartLink.href ?? '/'} className="relative flex items-center justify-center">
      {cartItems > 0 && (
        <Typography
          fontSize={10}
          className="absolute -right-2 top-[-14px] rounded-full bg-primary px-[5px] py-[2px] text-white lg:right-[-12px]"
        >
          {cartItems.toString()}
        </Typography>
      )}
      <Typography fontSize={16} className="hidden text-gray-700 lg:block">
        {translate('common.cart')}
      </Typography>
      <ShoppingCartIcon className="ml-0 w-6 text-gray-700 lg:ml-2 lg:w-5" />
    </Link>
  );
};
export default CartLink;
