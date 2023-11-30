import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { PencilSquareIcon as EditIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import Accordion from '@/components/molecules/accordion';
import InfoTooltip from '@/components/atoms/info-tooltip';
import { SettingsPageProps } from './types';
import useAccordions from './hooks/useAccordions';
import ChangePasswordForm from './forms/change-password';
import DeleteAccountForm from './forms/delete-account';

const SettingsPage = ({ account, businessUnitOptions, onChangePassword, onDeleteAccount }: SettingsPageProps) => {
  const { translate } = useTranslation();

  const personalInfo = [
    { name: translate('common.name'), value: `${account.firstName} ${account.lastName}` },
    { name: translate('common.email'), value: account.email },
  ];

  const restrictedPersonalInfo = [
    {
      name: translate('common.business.unit'),
      value: businessUnitOptions.find((unit) => unit.value === account.businessUnit)?.name,
    },
    { name: translate('common.role'), value: account.role },
  ];

  const { accordionExpanded, expandAccordion, collapseAccordion } = useAccordions();

  return (
    <div>
      <div className="relative rounded-md border border-neutral-400 p-4 md:py-6">
        <div className="flex flex-col gap-6">
          {personalInfo.map(({ name, value }, index) => (
            <div className="text-14 text-gray-700" key={index}>
              <h6 className="text-14 font-medium leading-normal">{name}</h6>
              <span className="mt-3 block text-14 leading-normal">{value}</span>
            </div>
          ))}
        </div>
        <Link href="?subPath=edit-personal-info" className="absolute right-4 top-4">
          <EditIcon width={20} height={20} />
        </Link>
      </div>

      <div className="relative mt-4 rounded-md border border-neutral-400 p-4 md:mt-5 md:py-6">
        <div className="flex flex-col gap-6">
          {restrictedPersonalInfo.map(({ name, value }, index) => (
            <div className="text-14 text-gray-700" key={index}>
              <h6 className="text-14 font-medium leading-normal">{name}</h6>
              <span className="mt-3 block text-14 leading-normal">{value}</span>
            </div>
          ))}
        </div>
        <InfoTooltip content={translate('dashboard.modification.prohibited')} className="absolute right-4 top-4" />
      </div>

      <div className="mt-7 md:mt-9 lg:mt-11">
        <h2 className="font-extrabold text-gray-800 md:text-18 lg:text-20">{translate('common.integrity')}</h2>
        <div className="mt-4 md:mt-5 lg:mt-6">
          <Accordion
            className="rounded-b-none border-b-transparent"
            isExpanded={accordionExpanded.passwordChange}
            onExpand={() => expandAccordion('passwordChange')}
            onCollapse={() => collapseAccordion('passwordChange')}
          >
            <Accordion.Button className="text-14 font-medium leading-normal">
              {translate('dashboard.change.your.password')}
            </Accordion.Button>
            <Accordion.Panel>
              <ChangePasswordForm
                onCancel={() => collapseAccordion('passwordChange')}
                onChangePassword={onChangePassword}
              />
            </Accordion.Panel>
          </Accordion>

          <Accordion
            className="rounded-t-none"
            isExpanded={accordionExpanded.deleteAccount}
            onExpand={() => expandAccordion('deleteAccount')}
            onCollapse={() => collapseAccordion('deleteAccount')}
          >
            <Accordion.Button className="text-14 font-medium leading-[14px]">
              {translate('dashboard.delete.your.account')}
            </Accordion.Button>
            <Accordion.Panel>
              <DeleteAccountForm
                onCancel={() => collapseAccordion('deleteAccount')}
                onDeleteAccount={onDeleteAccount}
              />
            </Accordion.Panel>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
