import React, { useState } from 'react';
import Link from '@/components/atoms/link';
import Card from '@/components/molecules/card';
import InfoTooltip from '@/components/atoms/info-tooltip';
import EmptyState from '@/components/molecules/empty-state';
import { QuestionMarkCircleIcon as InfoIcon } from '@heroicons/react/24/outline';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import InfoBanner from '@/components/molecules/info-banner';
import useItems from '../../hooks/useItems';
import OrdersTable from '../orders/components/orders-table';
import { DashboardProps } from './types';
import { DashboardLinks } from '../../constants';

const DashboardPage = ({ orders, hasPendingApprovalFlows }: DashboardProps) => {
  const { translate } = useTranslation();
  const { cardItems } = useItems();

  const [showDisabledMessage, setShowDisabledMessage] = useState<Record<string, boolean>>({});

  const { ref } = useOnClickOutside(() => setShowDisabledMessage({}));

  return (
    <div className="flex flex-col">
      {hasPendingApprovalFlows && (
        <InfoBanner variant="warning" className="mt-3">
          {translate('dashboard.approval.flows.approve.ask')}{' '}
          <Link href={DashboardLinks.approvalFlows} className="underline">
            {translate('dashboard.approval.flows.section').toLowerCase()}
          </Link>
        </InfoBanner>
      )}

      <h1 className="py-6 text-18 font-extrabold text-gray-800 md:py-7 md:text-20 lg:py-9 lg:text-24">
        {translate('common.dashboard')}
      </h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3" ref={ref}>
        {cardItems.map(({ icon, name, summary, href, disabled, disabledMessage, order }) => (
          <div
            key={href}
            className="relative"
            style={{ order }}
            onClick={() => setShowDisabledMessage({ [href]: true })}
          >
            <Link
              href={href}
              className={`block w-full ${disabled ? 'opacity-50' : ''}`}
              underlineOnHover={false}
              {...(disabled ? { onClick: (e) => e.preventDefault() } : {})}
            >
              <Card icon={icon} title={name} summary={summary} />
            </Link>
            {disabled && (
              <InfoTooltip
                isOpen={!!showDisabledMessage[href]}
                setIsOpen={(val) => setShowDisabledMessage({ ...showDisabledMessage, [href]: val })}
                icon={InfoIcon}
                className="absolute right-3 top-3"
                content={disabledMessage}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-7 md:mt-9 lg:mt-11">
        <h2 className="mb-4 text-16 font-extrabold text-gray-800 md:mb-5 md:text-18 lg:mb-6 lg:text-20">
          {translate('common.orders.latest')}
        </h2>
        {orders && orders.length > 0 ? (
          <OrdersTable orders={orders} />
        ) : (
          <EmptyState header={translate('common.no.results.found')} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
