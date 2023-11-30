import React from 'react';
import Typography from '@/components/atoms/typography';
import useTranslation from '@/providers/I18n/hooks/useTranslation';

const OrderStatusBar = () => {
  const { translate } = useTranslation();

  return (
    <div className="mt-14 flex w-full justify-center pb-12 md:border-b">
      <div className="relative h-fit w-full justify-center pb-16">
        <div className="absolute left-1/2 h-2 w-[98%] -translate-x-1/2 -translate-y-1/2 bg-gray-300" />
        <div className="absolute left-1 h-2 w-[50%] -translate-y-1/2 bg-primary" />
        <div className="absolute h-5 w-5 -translate-y-1/2 rounded-full bg-primary" />
        <div className="absolute top-5 flex flex-col items-center">
          <Typography as="h3" fontWeight="medium" className="w-32 text-left text-14 text-gray-700 lg:text-16">
            {translate('Ordered')}
          </Typography>
          <Typography as="h3" fontSize={14} className="mt-1 w-32 text-left text-gray-600 lg:text-16">
            Tue, Jan 16
          </Typography>
        </div>

        <div className="absolute left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        <div className="absolute left-1/2 top-5 -translate-x-1/2">
          <Typography align="center" as="h3" fontWeight="medium" fontSize={14} className="text-gray-700 lg:text-16">
            {translate('Shipped')}
          </Typography>

          <Typography as="h3" align="center" fontSize={14} className="mt-1 text-gray-600 lg:text-16">
            Fri, Jan 18
          </Typography>
        </div>

        <div className="absolute -right-2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-300" />
        <div className="absolute right-0 top-5">
          <Typography as="h3" fontWeight="medium" fontSize={14} className="text-right text-gray-700 lg:text-16">
            {translate('Delivered')}
          </Typography>

          <Typography as="h3" fontSize={14} className="mt-1 text-right text-gray-600 lg:text-16">
            Tue, Jan 22
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusBar;
