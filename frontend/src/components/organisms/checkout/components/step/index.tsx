import { classnames } from '@/utils/classnames/classnames';
import { CheckIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef } from 'react';
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
      className={classnames('rounded-lg bg-white p-5 lg:p-9', {
        'border border-neutral-800 lg:border-none': !isActive && !isCompleted,
      })}
    >
      <div
        className={classnames('flex cursor-pointer items-center justify-between rounded-md bg-white')}
        onClick={onNavigate}
      >
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="inline-flex size-8 flex-col items-center justify-center gap-2.5 rounded-3xl bg-emerald-200 p-1 outline outline-1 outline-offset-[-1px] outline-emerald-200">
              <div className="relative size-5 overflow-hidden">
                <CheckIcon data-testid="check-icon" color="#1d6e5e" height={20} width={20} />
              </div>
            </div>
          ) : (
            <span
              className={classnames(
                'flex size-[24px] items-center justify-center rounded-full md:size-[30px]',
                isActive ? 'bg-primary font-medium text-white' : 'border border-gray-700 text-gray-700',
              )}
            >
              {number}
            </span>
          )}

          <span className={classnames('text-lg font-semibold leading-normal text-neutral-800 md:text-18 lg:text-20')}>
            {
              // eslint-disable-next-line
              // @ts-ignore
              translate(title)
            }
          </span>
        </div>

        {isCompleted && (
          <span className="text-sm font-semibold leading-none text-neutral-800 underline underline-offset-2">
            {translate('common.edit')}
          </span>
        )}
      </div>

      <div className={classnames('pt-6 lg:pt-7', { hidden: !(isActive || isCompleted) })}>{children}</div>
    </div>
  );
};

export default Step;
