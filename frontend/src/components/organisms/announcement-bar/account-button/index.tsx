import React, { useEffect } from 'react';
import Typography from '@/components/atoms/typography';
import Button from '@/components/atoms/button';
import PopoverButton from '@/components/molecules/popover';
import Select from '@/components/atoms/select';
import Link from '@/components/atoms/link';
import useDisclosure from '@/hooks/useDisclosure';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useScrollBlock from '@/hooks/useScrollBlock';
import { AccountButtonProps } from '../types';
import ButtonElement from './button';

const AccountButton = ({
  selectedBusinessUnit,
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
  const { translate } = useTranslation();
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
    <PopoverButton
      isOpen={isOpen}
      direction="right"
      onClose={onClose}
      buttonElement={() => <ButtonElement onOpen={onOpen} />}
    >
      <div className="max-h-[90vh] w-[330px] overflow-y-auto py-4">
        <div className="px-4">
          <div className="pt-2">
            <Typography fontSize={18} fontWeight="bold" className="text-primary">
              {`${translate('account.hello')} ${name}!`}
            </Typography>
          </div>
          <div className="pt-5">
            <Typography fontSize={14} className="text-gray-800">
              {translate('account.business.unit')}
            </Typography>
            <Select
              enableSearch
              className="z-[100] pt-2"
              size="lg"
              value={selectedBusinessUnit}
              options={businessUnits}
              onChange={onBusinessUnitChange}
            />
          </div>
          <div className="py-4">
            <Typography fontSize={14} className="text-gray-800">
              {translate('account.store')}
            </Typography>
            <Select
              enableSearch
              className="pt-2"
              size="lg"
              placeholder="Select"
              defaultValue={selectedStore}
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
              <div className="mr-4 flex h-5 w-5 items-center justify-center rounded-md bg-blue-100">
                <Typography fontSize={12} fontWeight="semibold" align="center" className="text-primary">
                  {quotes.toString()}
                </Typography>
              </div>
            )}
          </div>
        ))}
        <div className="h-[1px] border-t" />

        <div className="px-4 pt-4">
          <div className="flex flex-col gap-y-4 pb-5 pt-1">
            <Typography fontSize={14} fontWeight="bold" className="text-primary">
              {translate('account.help.center')}
            </Typography>
            <Typography fontSize={14} className="text-gray-700">
              {translate('account.mon.fri')}
            </Typography>
          </div>
          <Button variant="secondary" size="full" onClick={handleLogoutClick}>
            {translate('account.sign.out')}
          </Button>
        </div>
      </div>
    </PopoverButton>
  );
};
export default AccountButton;
