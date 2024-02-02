import React from 'react';
import useDisclosure from '@/hooks/useDisclosure';
import { AdjustmentsHorizontalIcon as FiltersIcon } from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Drawer from '@/components/organisms/drawer';
import Button from '@/components/atoms/button';
import Accordion from '@/components/molecules/accordion';
import Radio from '@/components/atoms/radio';
import SearchInput from '@/components/atoms/search-input';
import Checkbox from '@/components/atoms/checkbox';
import DatePicker from '@/components/molecules/date-picker';
import { OrdersPageProps } from '../../types';

const RefinementsDrawer = ({
  orders: quotes,
  sortOptions,
  filters,
  onSortBy,
  onSearch,
  onClearRefinements,
  statusOptions,
  onStatusRefine,
  onCreationDateRefine,
}: Partial<OrdersPageProps>) => {
  const { translate } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen: isDatePickerOpen, onClose: onCloseDatePicker, onToggle: onToggleDatePicker } = useDisclosure();

  const refinements = [
    {
      title: 'product.sortBy',
      Component: (
        <div className="flex flex-col gap-7">
          {(sortOptions ?? []).map(({ name, value }) => (
            <Radio key={value} label={name} checked={value === filters?.sort} onSelected={() => onSortBy?.(value)} />
          ))}
        </div>
      ),
    },
    {
      title: 'dashboard.quote.search',
      Component: (
        <SearchInput
          searchValue={filters?.search ?? ''}
          variant="sm"
          placeholder={`${translate('dashboard.search.for.orders')}...`}
          handleOnChange={(val) => onSearch?.(val)}
        />
      ),
    },
    {
      title: 'dashboard.order.status',
      Component: (
        <div className="flex flex-col gap-7">
          {(statusOptions ?? []).map(({ name, value }) => (
            <Checkbox
              key={value}
              label={name}
              checked={filters?.status?.includes(value)}
              onChecked={(checked) => onStatusRefine?.(checked ? value : '')}
            />
          ))}
        </div>
      ),
    },
    {
      title: 'dashboard.creation.date',
      Component: (
        <div>
          <div
            onClick={onToggleDatePicker}
            className="rounded-md border border-gray-300 px-3 py-2 text-14 text-gray-600"
          >
            {filters?.createdFrom || filters?.createdTo
              ? `${filters.createdFrom ? new Date(filters.createdFrom).toLocaleDateString() : ''} : ${
                  filters.createdTo ? new Date(filters.createdTo).toLocaleDateString() : ''
                }`
              : 'dd/mm/yy'}
          </div>
          {isDatePickerOpen && (
            <div>
              <DatePicker
                mode="range"
                selected={{
                  from: filters?.createdFrom ? new Date(filters?.createdFrom) : undefined,
                  to: filters?.createdTo ? new Date(filters?.createdTo) : undefined,
                }}
                onSelect={(range) => onCreationDateRefine?.({ from: range?.from, to: range?.to })}
              />
              <div className="mt-2 flex items-center justify-end gap-8 pr-8">
                <span className="text-14 font-medium uppercase text-primary" onClick={onCloseDatePicker}>
                  {translate('common.cancel')}
                </span>
                <span
                  className="text-14 font-medium uppercase text-primary"
                  onClick={() => {
                    onCloseDatePicker();
                  }}
                >
                  {translate('common.save')}
                </span>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="lg:hidden">
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 p-2 text-14 text-gray-600 transition hover:bg-gray-50 md:w-fit md:grow-0"
        onClick={onOpen}
      >
        <span>{translate('product.sortAndFilter')}</span>
        <FiltersIcon width={20} />
      </button>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        direction="left"
        headline={translate('product.sortAndFilter')}
        className="h-[100vh] w-[90vw] max-w-[350px]"
        headerClassName="border-y border-neutral-400"
      >
        <div className="flex h-full flex-col">
          <div className="grow overflow-y-auto px-4 lg:px-5">
            {refinements.map(({ title, Component }, index) => (
              <div key={index} className="border-b border-neutral-400">
                <Accordion className="border-none">
                  <Accordion.Button className="py-5" defaultSpacing={false}>
                    <span className="text-14 font-bold">{translate(title)}</span>
                  </Accordion.Button>
                  <Accordion.Panel defaultSpacing={false} className="pb-6">
                    {Component}
                  </Accordion.Panel>
                </Accordion>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 border-t border-neutral-400 p-4 lg:p-5">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                onClearRefinements?.();
                onClose();
              }}
            >
              {translate('product.clear.all')}
            </Button>
            <Button variant="primary" className="flex-1" onClick={onClose}>
              {translate('common.view')} ({quotes?.length})
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default RefinementsDrawer;
