import React from 'react';
import { useTranslations } from 'use-intl';
import { XMarkIcon as CloseIcon } from '@heroicons/react/24/solid';
import { QuotesPageProps } from '../../types';

const CurrentRefinements = ({ filters, onClearRefinements, onStatusRefine }: Partial<QuotesPageProps>) => {
  const translate = useTranslations();

  if (!filters?.status?.length) return <></>;

  return (
    <div className="mt-5 lg:mt-8">
      <div className="flex flex-wrap gap-3">
        <button
          className="cursor-pointer rounded-md border border-gray-300 px-2 py-[6px] text-14 leading-[20px] text-gray-700"
          onClick={onClearRefinements}
        >
          {translate('dashboard.clear-all')}
        </button>
        {filters.status.map((state) => (
          <div
            key={state}
            className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-200 px-2 py-[6px] text-14 leading-[20px] text-gray-700"
          >
            <span>
              {
                // eslint-disable-next-line
                // @ts-ignore
                translate(`dashboard.quote-status-${state.toLowerCase()}`)
              }
            </span>
            <button onClick={() => onStatusRefine?.(filters.status?.filter((s) => s !== state) ?? [])}>
              <CloseIcon
                className="cursor-pointer text-gray-700"
                width={16}
                height={16}
                onClick={() => onStatusRefine?.(filters.status?.filter((s) => s !== state) ?? [])}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentRefinements;
