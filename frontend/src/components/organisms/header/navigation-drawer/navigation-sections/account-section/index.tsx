import React, { useContext } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Select from '@/components/atoms/select';
import { useTranslations } from 'use-intl';
import { HeaderContext } from '../../../context';

const AccountSection = () => {
  const translate = useTranslations();
  const {
    navigationLevel,
    insertCategory,
    myAccountMenu: myAccount,
    selectedBusinessUnit,
    businessUnits,
    selectedStore,
    stores,
    onBusinessUnitChange,
    onStoreChange,
  } = useContext(HeaderContext);

  return (
    <>
      <div className="block border-t lg:hidden">
        {navigationLevel.length > 0 ? (
          <>
            {navigationLevel[navigationLevel.length - 1].name === 'My Account' && (
              <>
                <div className="pt-4">
                  <p className="text-14 text-gray-800">{translate('account.business-unit')}</p>
                  <Select
                    className="z-[100] pt-2"
                    size="lg"
                    placeholder="Select"
                    defaultValue={selectedBusinessUnit}
                    options={businessUnits}
                    onChange={onBusinessUnitChange}
                  />
                </div>
                <div className="pb-2 pt-4">
                  <p className="text-14 text-gray-800">{translate('account.store')}</p>
                  <Select
                    className="pt-2"
                    size="lg"
                    placeholder="Select"
                    defaultValue={selectedStore}
                    options={stores}
                    onChange={onStoreChange}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex h-[56px] items-center justify-between" onClick={() => insertCategory(myAccount)}>
            <p className="text-16 font-semibold text-gray-700">{myAccount.name}</p>
            <ChevronRightIcon className="w-5 text-gray-700" />
          </div>
        )}
      </div>
    </>
  );
};
export default AccountSection;
