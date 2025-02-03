import React, { useContext } from 'react';
import Button from '@/components/atoms/button';
import Typography from '@/components/atoms/typography';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { HeaderContext } from '../../../context';

const BackButton = () => {
  const { translate } = useTranslation();
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
        Icon={ChevronLeftIcon}
        variant="ghost"
        size="l"
        className="hover:underline"
      >
        <Typography fontSize={14} fontWeight="medium" className="text-primary">
          {translate('common.back')}
        </Typography>
      </Button>
    </div>
  );
};

export default BackButton;
