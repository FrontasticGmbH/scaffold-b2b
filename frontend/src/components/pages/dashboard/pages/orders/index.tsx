import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { OrdersPageProps } from './types';
import RefinementsDrawer from './components/refinements-drawer';
import Refinements from './components/refinements';
import OrdersTable from './components/orders-table';
import CurrentRefinements from './components/current-refinements';

const OrdersPage = ({
  orders,
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
  const { translate } = useTranslation();

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

  const tableProps = { orders, totalItems, page, limit, onPageChange, onRowsPerPageChange };

  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 py-6 md:py-7 lg:py-9">
        <h1 className="text-18 font-extrabold text-gray-800 md:text-20 lg:text-24">{translate('common.orders')}</h1>
        <div className="rounded-md bg-primary px-[6px] py-[2px] text-12 font-semibold text-white">{orders.length}</div>
      </div>
      <div className="overflow-visible">
        <RefinementsDrawer {...refinementProps} />
        <Refinements {...refinementProps} />
        <CurrentRefinements {...currentRefinementsProps} />
        <OrdersTable {...tableProps} />
      </div>
    </div>
  );
};
export default OrdersPage;
