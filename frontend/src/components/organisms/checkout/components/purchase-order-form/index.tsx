import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Input from '@/components/atoms/input';
import { useTranslations } from 'use-intl';

const PurchaseOrderForm = ({
  defaultValues,
  onChange,
}: {
  defaultValues: { purchaseOrderNumber?: string; invoiceMemo?: string };
  onChange?: (data: { purchaseOrderNumber: string; invoiceMemo: string }) => void;
}) => {
  const translate = useTranslations();

  const {
    register,
    control,
    formState: { errors },
  } = useForm<{ purchaseOrderNumber: string; invoiceMemo: string }>({
    defaultValues: {
      purchaseOrderNumber: defaultValues.purchaseOrderNumber ?? '',
      invoiceMemo: defaultValues.invoiceMemo ?? '',
    },
  });

  const values = useWatch({ control, name: ['purchaseOrderNumber', 'invoiceMemo'] });

  useEffect(() => {
    onChange?.({
      purchaseOrderNumber: values[0],
      invoiceMemo: values[1],
    });
  }, [values[0], values[1]]);

  return (
    <form className="flex flex-col items-stretch gap-4 md:items-start" noValidate>
      <Input
        aria-label={translate('checkout.po-number')}
        className="md:w-[280px]"
        label={translate('checkout.po-number')}
        error={errors.purchaseOrderNumber?.message}
        {...register('purchaseOrderNumber', {
          required: translate('common.fieldIsRequired'),
        })}
        required
      />
      <Input
        className="md:w-[280px]"
        label={translate('checkout.invoice-memo')}
        showOptionalLabel
        {...register('invoiceMemo')}
      />
    </form>
  );
};

export default PurchaseOrderForm;
