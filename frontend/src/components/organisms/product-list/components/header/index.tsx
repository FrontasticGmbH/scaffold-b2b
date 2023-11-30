import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { useProductList } from '../../context';

const Header = () => {
  const { title, limit, total } = useProductList();

  const { translate } = useTranslation();

  return (
    <div>
      <h1 className="pb-5 pt-6 text-18 font-bold capitalize text-gray-700 md:pt-7 md:text-20 xl:pt-5 xl:text-24">
        {title}
      </h1>
      <p className="text-14 text-gray-600">
        {translate('product.showing')} <span className="font-medium">1</span> -{' '}
        <span className="font-medium">{limit}</span> {translate('product.of')}{' '}
        <span className="font-medium">{total}</span> {translate('product.results')}
      </p>
    </div>
  );
};

export default Header;
