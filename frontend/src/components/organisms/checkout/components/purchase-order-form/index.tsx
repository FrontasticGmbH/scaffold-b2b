import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/components/atoms/input';
import { useTranslations } from 'use-intl';

// this is not being used but still made the changes, but couldnt test it properly
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
    watch,
    formState: { errors },
  } = useForm<{ purchaseOrderNumber: string; invoiceMemo: string }>({
    defaultValues: {
      purchaseOrderNumber: defaultValues.purchaseOrderNumber ?? '',
      invoiceMemo: defaultValues.invoiceMemo ?? '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    onChange?.(watchedValues);
  }, [watchedValues, onChange]);

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
