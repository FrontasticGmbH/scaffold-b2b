import React from 'react';
import { classnames } from '@/utils/classnames/classnames';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { Props } from './types';

const Step = ({ number, title, isActive, isCompleted, onNavigate, children }: React.PropsWithChildren<Props>) => {
  const { translate } = useTranslation();

  return (
    <div
      className={classnames('rounded-md bg-white lg:p-9', { 'border border-neutral-400 lg:border-none': !isActive })}
    >
      <div
        className={classnames(
          'flex cursor-pointer items-center justify-between rounded-md p-3 px-4 lg:p-0',
          isActive ? 'bg-primary lg:bg-white' : 'bg-white',
        )}
        onClick={onNavigate}
      >
        <div className="flex items-center gap-3">
          <span
            className={classnames(
              'flex h-[24px] w-[24px] items-center justify-center rounded-full md:h-[30px] md:w-[30px]',
              isActive
                ? 'bg-white font-medium text-primary lg:bg-primary lg:text-white'
                : 'border border-gray-700 text-gray-700',
            )}
          >
            {number}
          </span>
          <span
            className={classnames('md:text-18 lg:text-20', isActive ? 'text-white lg:text-gray-700' : 'text-gray-700')}
          >
            {translate(title)}
          </span>
        </div>

        {isCompleted && (
          <span className="text-14 text-neutral-900 underline underline-offset-2">{translate('common.edit')}</span>
        )}
      </div>

      {(isActive || isCompleted) && <div className="pt-4 md:pt-6 lg:pt-7">{children}</div>}
    </div>
  );
};

export default Step;
