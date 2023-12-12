import React from 'react';
import Typography from '@/components/atoms/typography';
import ShippingAndLanguageSection from '../shipping-and-language';
import AccountButton from './account-button';
import { AnnouncementBarProps } from './types';

const AnnouncementBar = ({
  textBar,
  myAccount,
  businessUnits,
  stores,
  name,
  quotas,
  onLogoutClick,
}: AnnouncementBarProps) => {
  return (
    <div className="relative flex h-10 w-full items-center justify-center bg-gray-700">
      <Typography fontSize={14} className="text-white">
        {textBar}
      </Typography>
      <div className="absolute right-10 hidden lg:block">
        <div className="flex justify-start gap-x-20">
          <AccountButton
            quotas={quotas}
            name={name}
            onLogoutClick={onLogoutClick}
            myAccount={myAccount}
            businessUnits={businessUnits}
            stores={stores}
          />
          <ShippingAndLanguageSection desktopDirection="right" />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
