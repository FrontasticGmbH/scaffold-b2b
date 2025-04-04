import React from 'react';
import { useTranslations } from 'use-intl';

const ModalHeader = () => {
  const translate = useTranslations();

  return <p className="mb-6 text-lg leading-tight text-gray-700 md:mb-8 md:text-xl">{translate('cart.item-added')}</p>;
};

export default ModalHeader;
