'use client';

import React from 'react';
import Dashboard from '@/components/pages/dashboard';
import SettingsPage from '@/components/pages/dashboard/pages/settings';
import { SettingsPageProps } from '@/components/pages/dashboard/pages/settings/types';
import useAccount from '@/lib/hooks/useAccount';
import useAccountRoles from '@/lib/hooks/useAccountRoles';
import useBusinessUnits from '@/lib/hooks/useBusinessUnits';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import { useStoreAndBusinessUnits } from '@/providers/store-and-business-units';
import useCustomRouter from '@/hooks/useCustomRouter';
import { filterChangedProps } from '@/utils/recursive';
import useRole from '../../hooks/useRole';
import useSubPath from '../../hooks/useSubPath';

const SettingsClientWrapper = () => {
  const { account, updateAccount, changePassword, deleteAccount, logout } = useAccount();

  const router = useCustomRouter();

  const { businessUnits } = useBusinessUnits();

  const { selectedBusinessUnit } = useStoreAndBusinessUnits();

  const { roles, isAdmin } = useAccountRoles(selectedBusinessUnit?.key);

  const { roleOptions } = useRole();

  const settingsProps = {
    account: {
      firstName: account?.firstName ?? '',
      lastName: account?.lastName ?? '',
      email: account?.email ?? '',
      businessUnit: businessUnits?.[0]?.key ?? '',
      roles: roles.filter((role) => !!role.key).map((role) => role.key),
    },
    businessUnitOptions: businessUnits.map(({ name, key }) => ({ name: name ?? key ?? '', value: key ?? '' })),
    roleOptions,
    isAdmin,
    onUpdateAccount: async (accountUpdatePayload) => {
      if (!account) return;

      await updateAccount(filterChangedProps(accountUpdatePayload, account));
    },
    onChangePassword: async (oldPassword, newPassword) => {
      await changePassword(oldPassword, newPassword);
    },
    onDeleteAccount: async (password: string) => {
      const res = await deleteAccount(password);
      if (res.success) {
        await logout();
        router.refresh();
      }
      return res.success;
    },
  } as SettingsPageProps;

  const { ActiveSubPath } = useSubPath(settingsProps);

  return (
    <Dashboard
      title={ActiveSubPath?.title ?? 'account.settings-security'}
      href={DashboardLinks.settings}
      userName={account?.firstName}
    >
      {ActiveSubPath?.Component ?? <SettingsPage {...settingsProps} />}
    </Dashboard>
  );
};

export default SettingsClientWrapper;
