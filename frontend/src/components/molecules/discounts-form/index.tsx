import React from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import Input from '@/components/atoms/input';
import { DiscountFormProps } from './types';
import Accordion from '../accordion';

const DiscountsForm = ({ className, discounts, onSubmit, customError }: DiscountFormProps) => {
  const translate = useTranslations();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<{ code: string }>({
    defaultValues: { code: '' },
  });

  const discountsContainerClassName = classnames(
    'mt-2 flex flex-wrap justify-items-start gap-3',
    discounts?.length === 0 ? 'pt-0' : 'pt-1',
  );

  const containerClassName = classnames('border-t border-neutral-400 py-4 text-16', className);

  const onApplyDiscount = async (data: { code: string }) => {
    const success = await onSubmit?.(data.code.trim());

    if (!success) {
      setError('code', {
        type: 'manual',
        message: customError || translate('cart.codeNotValid'),
      });
    } else {
      setValue('code', '');
    }
  };

  const onClearForm = () => {
    setValue('code', '');
  };

  return (
    <div className={containerClassName}>
      <Accordion className="border-0">
        <Accordion.Button defaultSpacing={false} className="text-gray-600">
          {translate('cart.discount-apply')}
        </Accordion.Button>
        <Accordion.Panel defaultSpacing={false}>
          <form className="pt-6" onSubmit={handleSubmit(onApplyDiscount)} noValidate>
            <Input
              aria-label={translate('cart.discount-code')}
              className={classnames(
                errors.code ? 'border-red-500 text-red-500 focus:border-red-500' : 'border-neutral-300',
              )}
              placeholder={translate('cart.discount-enter')}
              disabled={isSubmitting}
              icon={
                errors.code ? (
                  <XMarkIcon className="size-[20px] cursor-pointer" onClick={onClearForm} data-testid="clear-input" />
                ) : null
              }
              error={errors.code?.message}
              {...register('code', {
                required: translate('common.fieldIsRequired'),
              })}
              required
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
