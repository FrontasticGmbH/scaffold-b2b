import React from 'react';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { QuickOrderMobileProps } from '../types';

const QuickOrderMobile = ({ showQuickOrderMenu }: QuickOrderMobileProps) => {
  const { translate } = useTranslation();
  return (
    <Button
      variant="ghost"
      size="fit"
      className="block pb-8 underline-offset-8 hover:underline lg:hidden"
      onClick={showQuickOrderMenu}
    >
      <Typography fontSize={16} fontWeight="semibold" className="text-gray-800">
        {translate('quick-order.quick.order')}
      </Typography>
    </Button>
  );
};

export default QuickOrderMobile;
