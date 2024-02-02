import React from 'react';
import Typography from '@/components/atoms/typography';
import useTranslation from '@/providers/I18n/hooks/useTranslation';

const ModalHeader = () => {
  const { translate } = useTranslation();

  return (
    <Typography lineHeight="tight" className="mb-6 text-lg text-gray-700 md:mb-8 md:text-xl">
      {translate('cart.item.added')}
    </Typography>
  );
};

export default ModalHeader;
