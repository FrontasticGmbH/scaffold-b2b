import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';

const PurchaseOrderPreview = () => {
  const { translate } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <p className="text-14 font-medium leading-loose text-gray-700">{translate('checkout.purchase.order')}</p>
      <p className="text-14 leading-loose text-gray-700">****</p>
    </div>
  );
};

export default PurchaseOrderPreview;
