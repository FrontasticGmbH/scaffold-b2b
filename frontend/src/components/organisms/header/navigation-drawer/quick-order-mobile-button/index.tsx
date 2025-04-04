import React from 'react';
import Button from '@/components/atoms/button';
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
      <p className="text-16 font-semibold text-gray-800">{translate('quick-order.quick-order')}</p>
    </Button>
  );
};

export default QuickOrderMobileButton;
