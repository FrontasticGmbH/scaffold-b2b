import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import Input from '@/components/atoms/input';
import { DiscountFormProps } from './types';
import Accordion from '../accordion';

const DiscountsForm = ({ className, discounts, onSubmit, customError }: DiscountFormProps) => {
  const translate = useTranslations();

  const { setValue, watch, handleSubmit } = useForm<{ code: string }>({
    defaultValues: { code: '' },
  });

  const code = watch('code');
  const [codeIsInvalid, setCodeIsInvalid] = useState(false);

  const [processing, setProcessing] = useState(false);

  const inputClassName = classnames(
    codeIsInvalid ? 'border-red-500 text-red-500 focus:border-red-500' : 'border-neutral-300',
  );

  const discountsContainerClassName = classnames(
    'mt-2 flex flex-wrap justify-items-start gap-3',
    discounts?.length === 0 ? 'pt-0' : 'pt-1',
  );

  const containerClassName = classnames('border-t border-neutral-400 py-4 text-16', className);

  const onApplyDiscount = async () => {
    if (processing || !code) return;

    setProcessing(true);

    const success = await onSubmit?.(code);

    setCodeIsInvalid(!success);

    if (success) setValue('code', '');

    setProcessing(false);
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyDiscount();
  };

  const onClearForm = () => {
    setValue('code', '');
    setCodeIsInvalid(false);
  };

  return (
    <div className={containerClassName}>
      <Accordion className="border-0">
        <Accordion.Button defaultSpacing={false} className="text-gray-600">
          {translate('cart.discount-apply')}
        </Accordion.Button>
        <Accordion.Panel defaultSpacing={false}>
          <form className="pt-6" onSubmit={onFormSubmit}>
            <Input
              aria-label={translate('cart.discount-code')}
              className={inputClassName}
              value={code}
              placeholder={translate('cart.discount-enter')}
              onChange={(e) => {
                setValue('code', e.target.value);
                setCodeIsInvalid(false);
              }}
              disabled={processing}
              icon={
                codeIsInvalid ? (
                  <XMarkIcon className="size-[20px] cursor-pointer" onClick={onClearForm} data-testid="clear-input" />
                ) : null
              }
              error={codeIsInvalid ? customError || translate('cart.codeNotValid') : undefined}
            />
          </form>

          {discounts && discounts.length > 0 && (
            <div className={discountsContainerClassName}>
              {discounts.map((discount) => (
                <div
                  key={discount.code}
                  className="mr-1 flex w-fit justify-between gap-2 rounded-sm border border-neutral-400 bg-white px-2 py-1"
                >
                  <label className="text-12 uppercase leading-[16px] text-secondary">{discount.code}</label>
                  <button type="button" className="shrink-0" onClick={discount.onRemove}>
                    <XMarkIcon data-testid="remove-discount-code" className="size-4 text-secondary" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Accordion.Panel>
      </Accordion>
    </div>
  );
};

export default DiscountsForm;
