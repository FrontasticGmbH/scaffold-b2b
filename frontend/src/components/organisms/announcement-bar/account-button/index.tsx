import React, { useEffect } from 'react';
import Button from '@/components/atoms/button';
import Popover from '@/components/molecules/popover';
import Select from '@/components/atoms/select';
import Link from '@/components/atoms/link';
import useDisclosure from '@/hooks/useDisclosure';
import { useTranslations } from 'use-intl';
import useScrollBlock from '@/hooks/useScrollBlock';
import { AccountButtonProps } from '../types';
import ButtonElement from './button';

const AccountButton = ({
  selectedBusinessUnit,
  businessUnitIsLoading,
  businessUnits,
  selectedStore,
  stores,
  accountLinks,
  name,
  quotes,
  onLogoutClick,
  onBusinessUnitChange,
  onStoreChange,
}: AccountButtonProps) => {
  const translate = useTranslations();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogoutClick = () => {
    onLogoutClick();
    onClose();
  };

  const { blockScroll } = useScrollBlock();
  useEffect(() => {
    blockScroll(isOpen);
  }, [blockScroll, isOpen]);

  return (
    <Popover
      isOpen={isOpen}
      direction="right"
      onClose={onClose}
      buttonElement={() => <ButtonElement onOpen={onOpen} />}
    >
      <div className="max-h-[90vh] w-[330px] overflow-y-auto py-4">
        <div className="px-4">
          <div className="pt-2">
            <p className="text-18 font-bold text-primary">{`${translate('account.hello')} ${name}!`}</p>
          </div>
          <div className="pt-5">
            <p className="text-14 text-gray-800">{translate('account.business-unit')}</p>
            <Select
              enableSearch
              className="pt-2"
              size="lg"
              value={selectedBusinessUnit}
              defaultValue={translate('common.select')}
              disabled={businessUnitIsLoading}
              options={businessUnits}
              onChange={onBusinessUnitChange}
            />
          </div>
          <div className="py-4">
            <p className="text-14 text-gray-800">{translate('account.store')}</p>
            <Select
              enableSearch
              className="pt-2"
              size="lg"
              placeholder="Select"
              value={selectedStore}
              defaultValue={translate('common.select')}
              disabled={businessUnitIsLoading}
              options={stores}
              onChange={onStoreChange}
            />
          </div>
        </div>
        {accountLinks.map((account, key) => (
          <div key={key} className="flex items-center justify-between border-t">
            <Link href={account.path ?? '/'} className="px-4 py-3 text-14">
              {account.name}
            </Link>
            {account.categoryId === 'quotes' && (
              <div className="mr-4 flex size-5 items-center justify-center rounded-md bg-blue-100">
                <p className="text-center text-12 font-semibold text-primary">{quotes.toString()}</p>
              </div>
            )}
          </div>
        ))}
        <div className="h-px border-t" />

        <div className="px-4 pt-4">
          <div className="flex flex-col gap-y-4 pb-5 pt-1">
            <p className="text-14 font-bold text-primary">{translate('account.help-center')}</p>
            <p className="text-14 text-gray-700">{translate('account.mon-fri')}</p>
          </div>
          <Button variant="secondary" size="full" data-testid="logout-button" onClick={handleLogoutClick}>
            {translate('account.sign-out')}
          </Button>
        </div>
      </div>
    </Popover>
  );
};
export default AccountButton;
