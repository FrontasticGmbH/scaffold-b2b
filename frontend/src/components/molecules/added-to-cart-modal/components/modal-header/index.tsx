import React from 'react';
import Typography from '@/components/atoms/typography';
import { useTranslations } from 'use-intl';

const ModalHeader = () => {
  const translate = useTranslations();

  return (
    <Typography lineHeight="tight" className="mb-6 text-lg text-gray-700 md:mb-8 md:text-xl">
      {translate('cart.item-added')}
    </Typography>
  );
};

export default ModalHeader;
