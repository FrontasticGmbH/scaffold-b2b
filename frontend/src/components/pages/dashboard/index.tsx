'use client';

import React from 'react';
import Sidebar from '@/components/organisms/sidebar';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useItems from './hooks/useItems';
import { DashboardProps } from './types';

const Dashboard = ({ title, href, children, userName }: React.PropsWithChildren<DashboardProps>) => {
  const { translate } = useTranslation();

  const { sidebarItems } = useItems();

  return (
    <div className="relative flex items-start gap-6 2xl:min-h-[calc(100vh-123px)]">
      <div className="sticky top-[112px] hidden h-[calc(100vh-112px)] w-max shrink-0 2xl:block">
        <Sidebar
          title={translate('common.say.hi', { values: { name: userName ?? '' } })}
          links={sidebarItems.map((link) => ({ ...link, isActive: href === link.href }))}
        />
      </div>
      <div className="box-border min-h-[calc(100vh-131px)] max-w-full grow px-4 pb-6 md:px-5 md:pb-7 lg:min-h-[calc(100vh-83px)] lg:px-12 lg:pb-9 2xl:min-h-[unset]">
        {title && (
          <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
            {translate(title)}
          </h1>
        )}
        {children}
      </div>
    </div>
  );
};

export default Dashboard;
