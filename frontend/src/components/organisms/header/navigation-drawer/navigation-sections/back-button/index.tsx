import React, { useContext } from 'react';
import Button from '@/components/atoms/button';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import { HeaderContext } from '../../../context';

const BackButton = () => {
  const translate = useTranslations();
  const { removeCategory, hideQuickOrderMenu } = useContext(HeaderContext);

  const handleBackPress = () => {
    removeCategory();
    hideQuickOrderMenu();
  };
  return (
    <div className="py-5 lg:py-6">
      <Button
        tabIndex={0}
        onClick={handleBackPress}
        iconPosition="left"
        variant="ghost"
        size="fit"
        className="flex items-center justify-between hover:underline"
      >
        <ChevronLeftIcon className="size-5" />
        <span className="text-14 font-medium text-primary">{translate('common.back')}</span>
      </Button>
    </div>
  );
};

export default BackButton;
