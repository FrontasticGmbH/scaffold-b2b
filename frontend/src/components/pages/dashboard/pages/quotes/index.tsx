import React, { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Tabs from '@/components/organisms/tabs';
import EmptyState from '@/components/molecules/empty-state';
import { QuestionMarkCircleIcon as InfoIcon } from '@heroicons/react/24/outline';
import useDisclosure from '@/hooks/useDisclosure';
import CurrentRefinements from './components/current-refinements';
import { QuotesPageProps } from './types';
import RefinementsDrawer from './components/refinements-drawer';
import Refinements from './components/refinements';
import QuotesTable from './components/quotes-table';
import QuotesStatusModal from './components/quotes-status-modal';
import QuotesRequestStatusModal from './components/quote-request-status-modal';

const QuotesPage = ({
  quotes,
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
  limit,
  onPageChange,
  onRowsPerPageChange,
  onSelectedChange,
}: QuotesPageProps) => {
  const { translate } = useTranslation();

  const router = useRouter();

  const searchParams = useSearchParams();

  const defaultSelected = searchParams.get('selected') ?? 'quotes';

  const [selected, setSelected] = useState<'quotes' | 'quotes.requests'>(
    defaultSelected as 'quotes' | 'quotes.requests',
  );

  const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose: onStatusModalClose } = useDisclosure();

  const StatusModal = selected === 'quotes' ? QuotesStatusModal : QuotesRequestStatusModal;

  const statusModalProps = { isOpen: isStatusModalOpen, onRequestClose: onStatusModalClose } as React.ComponentProps<
    typeof StatusModal
  >;

  const refinementProps = {
    quotes,
    onClearRefinements,
    onSearch,
    onStatusRefine,
    onCreationDateRefine,
    sortOptions,
    onSortBy,
    filters,
    statusOptions,
    onInfoClick: onStatusModalOpen,
  };

  const currentRefinementsProps = { onClearRefinements, filters, onSearch, onStatusRefine };

  const onNext = useCallback(() => {
    onPageChange?.(page + 1);
  }, [page, onPageChange]);

  const onPrevious = useCallback(() => {
    onPageChange?.(page - 1);
  }, [page, onPageChange]);

  const tablePaginationProps = { page, limit, totalItems, onNext, onPrevious, onRowsPerPageChange };

  return (
    <div className="pb-12">
      <div className="flex items-center justify-between py-6 md:py-7 lg:py-9">
        <div className="flex items-center gap-3">
          <h1 className="text-18 font-extrabold text-gray-800 md:text-20 lg:text-24">
            {translate(`common.${selected}`)}
          </h1>
          {quotes.length > 0 && (
            <div className="rounded-md bg-primary px-[6px] py-[2px] text-12 font-semibold text-white">
              {quotes.length}
            </div>
          )}
        </div>
        <InfoIcon className="h-[24px] w-[24px] cursor-pointer text-gray-600 md:hidden" onClick={onStatusModalOpen} />
      </div>
      <div>
        <Tabs
          defaultActiveIndex={defaultSelected === 'quotes' ? 0 : 1}
          onActiveIndexChange={(index) => {
            const newSelected = index === 0 ? 'quotes' : 'quotes.requests';
            setSelected(newSelected);
            onSelectedChange?.(newSelected);
            router.replace(`?selected=${newSelected}`);
          }}
        >
          <Tabs.TabList>
            <Tabs.Tab>
              <span className="capitalize">{translate('dashboard.quotes.all')}</span>
            </Tabs.Tab>
            <Tabs.Tab>
              <div className="flex items-center gap-2">
                <span className="capitalize">{translate('common.quotes.requests')}</span>
              </div>
            </Tabs.Tab>
          </Tabs.TabList>
          <Tabs.Panels className="overflow-visible">
            <Tabs.Panel>
              <RefinementsDrawer {...refinementProps} />
              <Refinements {...refinementProps} />
              <CurrentRefinements {...currentRefinementsProps} />
              {quotes.length > 0 ? (
                <>
                  <QuotesTable quotes={quotes} pagination={tablePaginationProps} />
                </>
              ) : (
                <EmptyState isLoading={loading} header={translate('common.no.results.found')} />
              )}
            </Tabs.Panel>
            <Tabs.Panel>
              <RefinementsDrawer {...refinementProps} />
              <Refinements {...refinementProps} />
              <CurrentRefinements {...currentRefinementsProps} />
              {quotes.length > 0 ? (
                <>
                  <QuotesTable quotes={quotes} pagination={tablePaginationProps} />
                </>
              ) : (
                <EmptyState isLoading={loading} header={translate('common.no.results.found')} />
              )}
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>

      <StatusModal {...statusModalProps} />
    </div>
  );
};

export default QuotesPage;
