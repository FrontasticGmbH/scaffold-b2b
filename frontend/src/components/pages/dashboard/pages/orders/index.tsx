import React, { useCallback } from 'react';
import { useTranslations } from 'use-intl';
import EmptyState from '@/components/molecules/empty-state';
import LoadingIcon from '@/components/atoms/loading-icon';
import { OrdersPageProps } from './types';
import RefinementsDrawer from './components/refinements-drawer';
import Refinements from './components/refinements';
import OrdersTable from './components/orders-table';
import CurrentRefinements from './components/current-refinements';

const OrdersPage = ({
  orders,
  loading,
  onClearRefinements,
  onStatusRefine,
  onCreationDateRefine,
  onSearch,
  sortOptions,
  onSortBy,
  filters,
  statusOptions,
  totalItems,
  page,
  onPageChange,
  onRowsPerPageChange,
  limit,
}: OrdersPageProps) => {
  const translate = useTranslations();

  const refinementProps = {
    orders,
    onClearRefinements,
    onSearch,
    onStatusRefine,
    onCreationDateRefine,
    sortOptions,
    onSortBy,
    filters,
    statusOptions,
  };

  const currentRefinementsProps = { onClearRefinements, filters, onSearch, onStatusRefine, onCreationDateRefine };

  const onNext = useCallback(() => {
    onPageChange?.(page + 1);
  }, [page, onPageChange]);

  const onPrevious = useCallback(() => {
    onPageChange?.(page - 1);
  }, [page, onPageChange]);

  const tablePaginationProps = { totalItems, page, limit, onNext, onPrevious, onRowsPerPageChange };

  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 py-6 md:py-7 lg:py-9">
        <h1 className="text-18 font-extrabold text-gray-800 md:text-20 lg:text-24">{translate('common.orders')}</h1>
        {orders.length > 0 && (
          <div className="rounded-md bg-primary px-[6px] py-[2px] text-12 font-semibold text-white">
            {orders.length}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-y-5 overflow-visible lg:gap-y-8">
        <RefinementsDrawer {...refinementProps} />
        <Refinements {...refinementProps} />
        <CurrentRefinements {...currentRefinementsProps} />

        <div>
          <OrdersTable orders={orders} pagination={loading ? undefined : tablePaginationProps} />

          {orders.length === 0 &&
            (loading ? (
              <div className="flex w-full justify-center border-x border-b border-neutral-400 py-8">
                <LoadingIcon svgWidth={20} svgHeight={20} className="fill-gray-700" />
              </div>
            ) : (
              <EmptyState header={translate('common.no-results-found')} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
