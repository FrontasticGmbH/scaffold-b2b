import React from 'react';
import { useTranslations } from 'use-intl';
import { Props } from './types';

const ShowMoreLabel = ({ isShowingAll }: Props) => {
  const translate = useTranslations();

  return (
    <span className="cursor-pointer text-14 font-medium text-primary transition hover:text-blue-500 lg:text-16">
      + {translate(isShowingAll ? 'common.show-less' : 'common.show-more')}
    </span>
  );
};

export default ShowMoreLabel;
