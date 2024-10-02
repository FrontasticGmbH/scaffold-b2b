import React from 'react';
import useDisclosure from '@/hooks/useDisclosure';
import {
  AdjustmentsHorizontalIcon as FiltersIcon,
  QuestionMarkCircleIcon as InfoIcon,
} from '@heroicons/react/24/outline';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Drawer from '@/components/organisms/drawer';
import Button from '@/components/atoms/button';
import Accordion from '@/components/molecules/accordion';
import Radio from '@/components/atoms/radio';
import SearchInput from '@/components/atoms/search-input';
import Checkbox from '@/components/atoms/checkbox';
import { QuotesPageProps } from '../../types';

const RefinementsDrawer = ({
  quotes,
  sortOptions,
  filters,
  onSortBy,
  onSearch,
  onClearRefinements,
  statusOptions,
  onStatusRefine,
  onInfoClick,
}: Partial<QuotesPageProps & { onInfoClick: () => void }>) => {
  const { translate } = useTranslation();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          placeholder={`${translate('dashboard.search.by.id.sku')}...`}
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
              onChecked={(checked) =>
                onStatusRefine?.(
                  checked ? [...(filters?.status ?? []), value] : (filters?.status?.filter((s) => s !== value) ?? []),
                )
              }
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-between gap-1 lg:hidden">
      <button
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 p-2 text-14 text-gray-600 transition hover:bg-gray-50 md:w-fit md:grow-0"
        onClick={onOpen}
      >
        <span>{translate('product.sortAndFilter')}</span>
        <FiltersIcon width={20} />
      </button>
      <div className="hidden items-center gap-1 text-gray-600 md:flex">
        <span className="text-14">{translate('common.status')}</span>
        <InfoIcon className="size-[24px] cursor-pointer" onClick={onInfoClick} />
      </div>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        direction="left"
        headline={translate('product.sortAndFilter')}
        className="h-screen w-[90vw] max-w-[350px] px-4 lg:px-5"
        headerClassName="border-y border-neutral-400 px-[0px]"
      >
        <div className="flex h-full flex-col">
          <div className="grow overflow-y-auto">
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
