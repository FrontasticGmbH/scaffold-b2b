import useDisclosure from '@/hooks/useDisclosure';
import { classnames } from '@/utils/classnames/classnames';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useTranslations } from 'use-intl';
import { ShowMoreProps } from './types';

const ShowMore = ({ children, className, renderLabel }: React.PropsWithChildren<ShowMoreProps>) => {
  const { isOpen: isShowingAll, onToggle } = useDisclosure();

  const translate = useTranslations();

  return (
    <div>
      <div className={isShowingAll ? 'block' : 'hidden'}>{children}</div>
      <span onClick={onToggle}>
        {renderLabel ? (
          renderLabel({ isShowingAll })
        ) : (
          <span
            className={classnames(
              'cursor-pointer text-14 font-semibold text-primary transition hover:text-blue-600',
              className,
            )}
          >
            {translate(isShowingAll ? 'common.show-less' : 'common.show-all')}{' '}
            {isShowingAll ? (
              <ChevronUpIcon width={16} strokeWidth={2.5} className="inline-block" />
            ) : (
              <ChevronDownIcon width={16} strokeWidth={2.5} className="inline-block" />
            )}
          </span>
        )}
      </span>
    </div>
  );
};

export default ShowMore;
