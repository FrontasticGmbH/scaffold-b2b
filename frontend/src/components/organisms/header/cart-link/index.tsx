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
          className="absolute -right-2 -top-3 rounded-lg bg-primary px-1 py-[2px] text-white lg:right-[-12px] lg:top-[-16px]"
        >
          {cartItems.toString()}
        </Typography>
      )}
      <Typography fontSize={16} className="hidden text-gray-700 lg:block">
        {translate('common.cart')}
      </Typography>
      <ShoppingCartIcon className="w-7 text-gray-700 lg:w-5" />
    </Link>
  );
};
export default CartLink;
