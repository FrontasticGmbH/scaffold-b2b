import React, { useMemo } from 'react';
import { useTranslations } from 'use-intl';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import { OrdersPageProps } from '../../types';

const CurrentRefinements = ({
  filters,
  onClearRefinements,
  onStatusRefine,
  onCreationDateRefine,
}: Partial<OrdersPageProps>) => {
  const translate = useTranslations();

  const appliedFilters = useMemo(() => {
    const result = [] as Array<{ name: string; onRefine: () => void }>;

    if (!filters) return result;

    if (filters.status?.length)
      result.push(
        ...filters.status.map((status) => ({
          // eslint-disable-next-line
          // @ts-ignore
          name: translate(`orders.status-${status.toLowerCase()}`),
          onRefine: () => onStatusRefine?.(filters.status?.filter((s) => s !== status) ?? []),
        })),
      );

    if (filters.createdFrom || filters.createdTo) {
      result.push({
        name: `${filters.createdFrom ? new Date(filters.createdFrom).toLocaleDateString() : ''} : ${
          filters.createdTo ? new Date(filters.createdTo).toLocaleDateString() : ''
        }`,
        onRefine: () => onCreationDateRefine?.({ from: undefined, to: undefined }),
      });
    }

    return result;
  }, [filters, onStatusRefine, onCreationDateRefine, translate]);

  if (!filters?.status?.length && !filters?.createdFrom && !filters?.createdTo) return <></>;

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <div
          className="cursor-pointer rounded-md border border-gray-300 px-2 py-[6px] text-14 leading-[20px] text-gray-700"
          onClick={onClearRefinements}
        >
          {translate('dashboard.clear-all')}
        </div>
        {appliedFilters.map(({ name, onRefine }) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-200 px-2 py-[6px] text-14 leading-[20px] text-gray-700"
          >
            <span>{name}</span>
            <CloseIcon className="cursor-pointer text-gray-700" width={16} height={16} onClick={onRefine} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentRefinements;
