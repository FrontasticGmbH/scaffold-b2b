import React, { useContext } from 'react';
import Typography from '@/components/atoms/typography';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Select from '@/components/atoms/select';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { HeaderContext } from '../../../context';

const AccountSection = () => {
  const { translate } = useTranslation();
  const { navigationLevel, insertCategory, myAccount, businessUnits, stores } = useContext(HeaderContext);

  return (
    <>
      <div className="block border-t lg:hidden">
        {navigationLevel.length > 0 ? (
          <>
            {navigationLevel[navigationLevel.length - 1].name === 'My Account' && (
              <>
                <div className="pt-4">
                  <Typography fontSize={14} className="text-gray-800">
                    {translate('account.business.unit')}
                  </Typography>
                  <Select className="z-[100] pt-2" size="sm" placeholder="Select" options={businessUnits} />
                </div>
                <div className="pb-2 pt-4">
                  <Typography fontSize={14} className="text-gray-800">
                    {translate('account.store')}
                  </Typography>
                  <Select className="pt-2" size="sm" placeholder="Select" options={stores} />
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex justify-between py-3" onClick={() => insertCategory(myAccount)}>
            <Typography fontSize={16} fontWeight="semibold" className="text-gray-700">
              {myAccount.name}
            </Typography>
            <ChevronRightIcon className="w-5 text-gray-700" />
          </div>
        )}
      </div>
    </>
  );
};
export default AccountSection;
