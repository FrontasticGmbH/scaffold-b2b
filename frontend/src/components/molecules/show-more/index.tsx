import React from 'react';
import useDisclosure from '@/hooks/useDisclosure';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
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
            {translate(isShowingAll ? 'common.show-less' : 'common.show-all')}
          </span>
        )}
      </span>
    </div>
  );
};

export default ShowMore;
