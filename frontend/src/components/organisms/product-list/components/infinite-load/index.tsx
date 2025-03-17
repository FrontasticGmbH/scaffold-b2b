import React from 'react';
import { useTranslations } from 'use-intl';
import Button from '@/components/atoms/button';
import { useProductList } from '../../context';

const InfiniteLoad = () => {
  const translate = useTranslations();

  const { limit, total, onLoadMore } = useProductList();

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-16 text-gray-700">
        {translate('product.showing')} {limit} {translate('product.of')} {total}
      </p>
      <Button
        variant="primary"
        size="m"
        className="min-w-[180px] text-16 font-medium"
        disabled={limit === total}
        onClick={onLoadMore}
      >
        {translate('product.load-more')}
      </Button>
    </div>
  );
};

export default InfiniteLoad;
