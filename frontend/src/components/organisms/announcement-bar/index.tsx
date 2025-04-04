import React from 'react';
import ShippingAndLanguageSection from '../shipping-and-language';
import AccountButton from './account-button';
import { AnnouncementBarProps } from './types';

const AnnouncementBar = ({
  textBar,
  accountLinks,
  selectedBusinessUnit,
  businessUnitIsLoading,
  businessUnits,
  selectedStore,
  stores,
  name,
  quotes,
  onLogoutClick,
  onBusinessUnitChange,
  onStoreChange,
}: AnnouncementBarProps) => {
  return (
    <div className="relative flex h-10 w-full items-center justify-center bg-gray-700">
      <p className="text-14 text-white">{textBar}</p>
      <div className="absolute right-10 hidden lg:block">
        <div className="flex justify-start gap-x-20">
          <AccountButton
            quotes={quotes}
            name={name}
            onLogoutClick={onLogoutClick}
            accountLinks={accountLinks}
            selectedBusinessUnit={selectedBusinessUnit}
            businessUnitIsLoading={businessUnitIsLoading}
            businessUnits={businessUnits}
            onBusinessUnitChange={onBusinessUnitChange}
            selectedStore={selectedStore}
            stores={stores}
            onStoreChange={onStoreChange}
          />
          <ShippingAndLanguageSection desktopDirection="right" />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
