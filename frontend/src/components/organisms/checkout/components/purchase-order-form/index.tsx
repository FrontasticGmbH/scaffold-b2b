import React, { useCallback, useState } from 'react';
import Input from '@/components/atoms/input';
import { useTranslations } from 'use-intl';

const PurchaseOrderForm = ({
  defaultValues,
  onChange,
}: {
  defaultValues: { purchaseOrderNumber?: string; invoiceMemo?: string };
  onChange?: (data: unknown) => void;
}) => {
  const translate = useTranslations();

  const [data, setData] = useState({
    purchaseOrderNumber: defaultValues.purchaseOrderNumber ?? '',
    invoiceMemo: defaultValues.invoiceMemo ?? '',
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData({ ...data, [e.target.name]: e.target.value });
      onChange?.({ ...data, [e.target.name]: e.target.value });
    },
    [data, onChange],
  );

  return (
    <form className="flex flex-col items-stretch gap-4 md:items-start">
      <Input
        aria-label={translate('checkout.po-number')}
        name="purchaseOrderNumber"
        className="md:w-[280px]"
        label={translate('checkout.po-number')}
        required
        value={data.purchaseOrderNumber}
        onChange={handleChange}
      />
      <Input
        name="invoiceMemo"
        className="md:w-[280px]"
        label={translate('checkout.invoice-memo')}
        showOptionalLabel
        value={data.invoiceMemo}
        onChange={handleChange}
      />
    </form>
  );
};

export default PurchaseOrderForm;
