import React from 'react';
import { useTranslations } from 'use-intl';

const PurchaseOrderPreview = () => {
  const translate = useTranslations();

  return (
    <div className="flex items-center justify-between">
      <p className="text-14 font-medium leading-loose text-gray-700">{translate('checkout.purchase-order')}</p>
      <p className="text-14 leading-loose text-gray-700">****</p>
    </div>
  );
};

export default PurchaseOrderPreview;
