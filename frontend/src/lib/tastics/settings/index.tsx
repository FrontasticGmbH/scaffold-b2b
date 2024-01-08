'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import SettingsPage from '@/components/pages/dashboard/pages/settings';
import { SettingsPageProps } from '@/components/pages/dashboard/pages/settings/types';
import useAccount from '@/lib/hooks/useAccount';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import useRole from './hooks/useRole';
import useSubPath from './hooks/useSubPath';

const SettingsTastic = () => {
  const { account, updateAccount, changePassword, deleteAccount } = useAccount();

  const { businessUnits, removeAssociate, addAssociate } = useBusinessUnits();

  const { role, isAdmin } = useAccountRoles();

  const { roleOptions } = useRole();

  const settingsProps = {
    account: {
      firstName: account?.firstName ?? '',
      lastName: account?.lastName ?? '',
      email: account?.email ?? '',
      businessUnit: businessUnits?.[0]?.key ?? '',
      role: role?.name ?? role?.key ?? '',
    },
    businessUnitOptions: businessUnits.map(({ name, key }) => ({ name: name ?? key ?? '', value: key ?? '' })),
    roleOptions,
    isAdmin,
    onUpdateAccount: async ({ businessUnit, role, ...accountPayload }) => {
      await updateAccount(accountPayload);
      await removeAssociate({ id: account?.accountId, businessUnit: businessUnit ?? '' });
      await addAssociate({ email: account?.email, role, businessUnit: businessUnit ?? '' });
    },
    onChangePassword: async (oldPassword, newPassword) => {
      await changePassword(oldPassword, newPassword);
    },
    onDeleteAccount: async (password: string) => {
      const res = await deleteAccount(password);
      return res.success;
    },
  } as SettingsPageProps;

  const { ActiveSubPath } = useSubPath(settingsProps);

  return (
    <Dashboard
      title={ActiveSubPath?.title ?? 'account.settings.security'}
      href={DashboardLinks.settings}
      userName={account?.firstName}
    >
      {ActiveSubPath?.Component ?? <SettingsPage {...settingsProps} />}
    </Dashboard>
  );
};

export default SettingsTastic;
