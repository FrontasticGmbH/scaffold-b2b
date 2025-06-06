import React, { useEffect, useRef } from 'react';
import { classnames } from '@/utils/classnames/classnames';
import { useTranslations } from 'use-intl';
import { Props } from './types';

const Step = ({ number, title, isActive, isCompleted, onNavigate, children }: React.PropsWithChildren<Props>) => {
  const translate = useTranslations();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      (ref.current as HTMLDivElement).scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [isActive]);

  return (
    <div
      ref={ref}
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
              'flex size-[24px] items-center justify-center rounded-full md:size-[30px]',
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
            {
              // eslint-disable-next-line
              // @ts-ignore
              translate(title)
            }
          </span>
        </div>

        {isCompleted && (
          <span className="text-14 text-gray-600 underline underline-offset-2">{translate('common.edit')}</span>
        )}
      </div>

      <div className={classnames('pt-4 md:pt-6 lg:pt-7', { hidden: !(isActive || isCompleted) })}>{children}</div>
    </div>
  );
};

export default Step;
