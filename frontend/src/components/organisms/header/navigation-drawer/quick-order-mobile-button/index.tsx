import React from 'react';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import { useTranslations } from 'use-intl';
import { QuickOrderMobileProps } from '../../types';

const QuickOrderMobileButton = ({ showQuickOrderMenu }: QuickOrderMobileProps) => {
  const translate = useTranslations();
  return (
    <Button
      variant="ghost"
      size="fit"
      className="block p-1 underline-offset-8 hover:underline lg:hidden"
      onClick={showQuickOrderMenu}
    >
      <Typography fontSize={16} fontWeight="semibold" className="text-gray-800">
        {translate('quick-order.quick-order')}
      </Typography>
    </Button>
  );
};

export default QuickOrderMobileButton;
